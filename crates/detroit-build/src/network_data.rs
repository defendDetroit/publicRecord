//! Generate `network-data.js` from TOML registries + overlay data.
//!
//! Reads config.toml (actors, entities) + data/edges.toml + overlay TOMLs
//! and outputs a `window.DETROIT_NETWORK` JavaScript file identical in
//! schema to the hand-maintained version.

use crate::graph::GraphEdge;
use crate::registry::Config;
use serde::Deserialize;
use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;

// ── Overlay data structures ─────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct OwnershipGroupsFile {
    group: Vec<OwnershipGroup>,
}

#[derive(Debug, Deserialize)]
struct OwnershipGroup {
    id: String,
    #[serde(default)]
    controller: Option<String>,
    label: String,
    members: Vec<String>,
    color: String,
    stroke: String,
    note: String,
}

#[derive(Debug, Deserialize)]
struct AddressClustersFile {
    cluster: Vec<AddressCluster>,
}

#[derive(Debug, Deserialize)]
struct AddressCluster {
    id: String,
    address: String,
    label: String,
    members: Vec<String>,
    color: String,
    stroke: String,
    note: String,
}

#[derive(Debug, Deserialize)]
struct OversightCyclesFile {
    cycle: Vec<OversightCycle>,
}

#[derive(Debug, Deserialize)]
struct OversightCycle {
    id: String,
    label: String,
    path: Vec<String>,
    note: String,
}

// ── Community overlay (optional label overrides for auto-detected communities) ──

#[derive(Debug, Deserialize)]
struct CommunitiesFile {
    #[serde(default)]
    community: Vec<CommunityOverride>,
}

#[derive(Debug, Deserialize)]
struct CommunityOverride {
    id: String,
    label: String,
    #[serde(default)]
    color: Option<String>,
    #[serde(default)]
    members: Vec<String>,
}

// ── Bench / lattice data (Anderson localization) ────────────────────────

#[derive(Debug, Deserialize)]
struct BenchFile {
    bench: Vec<Bench>,
}

#[derive(Debug, Deserialize)]
struct Bench {
    id: String,
    court: String,
    division: String,
    label: String,
    total_judges: u32,
    captured_judges: Vec<String>,
    case_types: Vec<String>,
    note: String,
    #[serde(default)]
    retired: bool,
}

#[derive(Debug, Deserialize)]
struct GeoFile {
    positions: BTreeMap<String, GeoPos>,
    #[serde(default)]
    aggregate: Vec<GeoAggregate>,
    #[serde(default)]
    flow: Vec<GeoFlow>,
}

#[derive(Debug, Deserialize)]
struct GeoPos {
    px: f64,
    py: f64,
}

#[derive(Debug, Deserialize)]
struct GeoAggregate {
    id: String,
    label: String,
    #[serde(rename = "type")]
    agg_type: String,
    px: f64,
    py: f64,
    detail: String,
    #[serde(default)]
    aggregates: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct GeoFlow {
    from: String,
    to: String,
    flow_type: String,
    label: String,
    amount: f64,
}

// ── Edge type mapping ───────────────────────────────────────────────────

/// Map investigation edge types to visualization edge types.
fn map_edge_type(edge_type: &str) -> &'static str {
    match edge_type {
        "employment" | "ownership" | "governance" | "board_membership"
        | "formation" | "appointment" | "property" => "controls",
        "money_flow" | "payment" | "financial" => "money",
        "family" => "family",
        "political" | "elected_office" | "referral" => "political",
        "bench" | "legal_representation" | "credential_legitimization"
        | "mentorship" | "classmate" => "judicial",
        "co-resident" | "corruption" => "associate",
        "campaign_vendor" | "family_donation" => "money",
        "authorization" | "investigation" | "permit" | "employment_family" => "institutional",
        _ => "associate",
    }
}

/// Map investigation edge types to flow categories.
fn map_flow(edge_type: &str) -> &'static str {
    match edge_type {
        "money_flow" | "payment" | "campaign_vendor" | "family_donation"
        | "financial" => "money",
        "ownership" | "governance" | "bench" | "appointment"
        | "employment" | "formation" | "authorization"
        | "investigation" | "permit" => "power",
        "board_membership" | "elected_office" | "employment_family" => "position",
        _ => "influence",
    }
}

// ── Node resolution ─────────────────────────────────────────────────────

struct VizNode {
    id: String,
    label: String,
    tier: u8,
    node_type: String,
    detail: String,
    url: Option<String>,
    nexus: Vec<String>,
    dynasty: Option<String>,
    era: Option<String>,
    community: usize,
}

fn resolve_nodes(config: &Config, edges: &[GraphEdge]) -> Vec<VizNode> {
    let mut nodes = Vec::new();
    let mut seen_ids = BTreeSet::new();

    for (key, actor) in &config.actors {
        let id = actor.graph_id.as_deref().unwrap_or(key).to_string();
        let node_type = actor.viz_type.as_deref().unwrap_or(
            match actor.tier {
                5 if actor.dynasty.as_deref() == Some("banks_flenory") => "bmf",
                5 => "political",
                3 | 4 if actor.role.contains("olitical") || actor.role.contains("ayor")
                    || actor.role.contains("xecutive") || actor.role.contains("ouncil") => "political",
                _ if actor.court.is_some() => "judge",
                _ => "actor",
            }
        );
        let detail = actor.detail.as_deref()
            .or(actor.connection.as_deref())
            .unwrap_or("")
            .to_string();
        let url = if actor.page.is_empty() { None } else { Some(actor.page.clone()) };

        nodes.push(VizNode {
            id: id.clone(),
            label: actor.short.clone(),
            tier: actor.tier,
            node_type: node_type.to_string(),
            detail,
            url,
            nexus: actor.nexus.clone(),
            dynasty: actor.dynasty.clone(),
            era: actor.era.clone(),
            community: 0,
        });
        seen_ids.insert(id);
    }

    for (key, entity) in &config.entities {
        let id = entity.graph_id.as_deref().unwrap_or(key).to_string();
        if seen_ids.contains(&id) {
            continue;
        }
        let node_type = entity.viz_type.as_deref().unwrap_or(
            match entity.entity_type.to_lowercase().as_str() {
                t if t.contains("charter school") || t.contains("charter school") => "school",
                t if t.contains("authorizer") || t.contains("agency") => "institutional",
                _ => "entity",
            }
        );
        let detail = entity.detail.as_deref()
            .or(entity.connection.as_deref())
            .unwrap_or("")
            .to_string();
        let url = if entity.page.is_empty() { None } else { Some(entity.page.clone()) };

        nodes.push(VizNode {
            id: id.clone(),
            label: entity.short.as_deref().unwrap_or(&entity.display).to_string(),
            tier: 0,
            node_type: node_type.to_string(),
            detail,
            url,
            nexus: entity.nexus.clone(),
            dynasty: entity.dynasty.clone(),
            era: entity.era.clone(),
            community: 0,
        });
        seen_ids.insert(id);
    }

    // Auto-create nodes for edge endpoints not in registries
    for edge in edges {
        for endpoint in [&edge.source, &edge.target] {
            if !seen_ids.contains(endpoint.as_str()) {
                nodes.push(VizNode {
                    id: endpoint.clone(),
                    label: endpoint.replace('_', " "),
                    tier: 4,
                    node_type: "institutional".to_string(),
                    detail: String::new(),
                    url: None,
                    nexus: Vec::new(),
                    dynasty: None,
                    era: None,
                    community: 0,
                });
                seen_ids.insert(endpoint.clone());
            }
        }
    }

    nodes
}

// ── Edge resolution ─────────────────────────────────────────────────────

struct VizEdge {
    source: String,
    target: String,
    edge_type: String,
    label: String,
    flow: String,
    amount: Option<f64>,
}

fn resolve_edges(edges: &[GraphEdge], node_ids: &BTreeSet<String>) -> Vec<VizEdge> {
    let mut viz_edges = Vec::new();

    for edge in edges {
        if !node_ids.contains(&edge.source) || !node_ids.contains(&edge.target) {
            continue;
        }

        let edge_type = edge.viz_type.as_deref()
            .unwrap_or_else(|| map_edge_type(&edge.edge_type))
            .to_string();
        let flow = edge.flow.as_deref()
            .unwrap_or_else(|| map_flow(&edge.edge_type))
            .to_string();
        let label = edge.label.as_deref()
            .or(edge.role.as_deref())
            .or(edge.note.as_deref())
            .unwrap_or("")
            .to_string();
        let amount = edge.viz_amount.or_else(|| {
            edge.amount.as_ref().and_then(|a| a.parse::<f64>().ok())
        });

        viz_edges.push(VizEdge {
            source: edge.source.clone(),
            target: edge.target.clone(),
            edge_type,
            label,
            flow,
            amount,
        });
    }

    viz_edges
}

// ── Louvain community detection ─────────────────────────────────────────

struct Community {
    id: usize,
    label: String,
    members: Vec<String>,
    color: String,
}

/// Louvain modularity optimization — assigns each node a community index.
/// Returns community assignments (indexed by node position in `nodes` slice)
/// and the list of detected communities.
fn compute_communities(
    nodes: &mut [VizNode],
    edges: &[VizEdge],
    overrides: &[CommunityOverride],
) -> Vec<Community> {
    let n = nodes.len();
    if n == 0 {
        return Vec::new();
    }

    // Build index: node_id → position (owned keys to avoid borrow conflicts)
    let id_to_idx: BTreeMap<String, usize> = nodes.iter().enumerate()
        .map(|(i, nd)| (nd.id.clone(), i))
        .collect();

    // Adjacency as edge weights (undirected, multi-edges sum)
    let mut adj: Vec<Vec<(usize, f64)>> = vec![Vec::new(); n];
    let mut total_weight = 0.0_f64;
    for e in edges {
        if let (Some(&si), Some(&ti)) = (id_to_idx.get(&e.source), id_to_idx.get(&e.target)) {
            if si != ti {
                adj[si].push((ti, 1.0));
                adj[ti].push((si, 1.0));
                total_weight += 1.0;
            }
        }
    }
    let m = total_weight;
    if m == 0.0 {
        for (i, nd) in nodes.iter_mut().enumerate() {
            nd.community = i;
        }
        return nodes.iter().map(|nd| Community {
            id: nd.community,
            label: nd.label.clone(),
            members: vec![nd.id.clone()],
            color: String::new(),
        }).collect();
    }

    // Degree of each node
    let k: Vec<f64> = adj.iter()
        .map(|neighbors| neighbors.iter().map(|(_, w)| w).sum())
        .collect();

    // Initialize: each node in its own community
    let mut comm: Vec<usize> = (0..n).collect();
    let mut sigma_tot: Vec<f64> = k.clone();

    // Iterate until no improvement
    let mut improved = true;
    let mut pass = 0;
    while improved && pass < 20 {
        improved = false;
        pass += 1;
        for i in 0..n {
            let ci = comm[i];
            let mut comm_edges: BTreeMap<usize, f64> = BTreeMap::new();
            for &(j, w) in &adj[i] {
                *comm_edges.entry(comm[j]).or_insert(0.0) += w;
            }
            let ki = k[i];
            let ki_in_current = comm_edges.get(&ci).copied().unwrap_or(0.0);
            let remove_cost = ki_in_current / m - (sigma_tot[ci] * ki) / (2.0 * m * m);

            let mut best_gain = 0.0;
            let mut best_comm = ci;
            for (&cj, &ki_in_cj) in &comm_edges {
                if cj == ci { continue; }
                let gain = ki_in_cj / m - (sigma_tot[cj] * ki) / (2.0 * m * m) - remove_cost;
                if gain > best_gain {
                    best_gain = gain;
                    best_comm = cj;
                }
            }

            if best_comm != ci {
                sigma_tot[ci] -= ki;
                sigma_tot[best_comm] += ki;
                comm[i] = best_comm;
                improved = true;
            }
        }
    }

    // Renumber communities to be contiguous 0..N
    let mut label_map: BTreeMap<usize, usize> = BTreeMap::new();
    let mut next_label = 0usize;
    for &c in &comm {
        if !label_map.contains_key(&c) {
            label_map.insert(c, next_label);
            next_label += 1;
        }
    }
    for c in &mut comm {
        *c = label_map[c];
    }

    // Merge small communities (< 3 members) into most-connected neighbor
    let min_size = 3;
    loop {
        let num_c = *comm.iter().max().unwrap_or(&0) + 1;
        let mut sizes: Vec<usize> = vec![0; num_c];
        for &c in &comm {
            sizes[c] += 1;
        }

        // Find a small community to merge
        let small = (0..num_c).find(|&c| sizes[c] > 0 && sizes[c] < min_size);
        let Some(sc) = small else { break };

        // Find the large community most connected to this small one
        let mut cross_edges: BTreeMap<usize, usize> = BTreeMap::new();
        for i in 0..n {
            if comm[i] != sc { continue; }
            for &(j, _) in &adj[i] {
                let cj = comm[j];
                if cj != sc && sizes[cj] >= min_size {
                    *cross_edges.entry(cj).or_insert(0) += 1;
                }
            }
        }
        let target = cross_edges.into_iter()
            .max_by_key(|&(_, count)| count)
            .map(|(c, _)| c);

        if let Some(tc) = target {
            for c in &mut comm {
                if *c == sc { *c = tc; }
            }
        } else {
            // No large neighbor — merge into the largest community overall
            let largest = (0..num_c).max_by_key(|&c| sizes[c]).unwrap_or(0);
            if largest != sc {
                for c in &mut comm {
                    if *c == sc { *c = largest; }
                }
            } else {
                break;
            }
        }
    }

    // Re-renumber after merging
    label_map.clear();
    next_label = 0;
    for &c in &comm {
        if !label_map.contains_key(&c) {
            label_map.insert(c, next_label);
            next_label += 1;
        }
    }
    for c in &mut comm {
        *c = label_map[c];
    }

    // Assign community to nodes
    for (i, nd) in nodes.iter_mut().enumerate() {
        nd.community = comm[i];
    }

    // Build community list with auto-labels from highest-degree member
    let num_communities = next_label;
    let mut community_members: Vec<Vec<String>> = vec![Vec::new(); num_communities];
    for nd in nodes.iter() {
        community_members[nd.community].push(nd.id.clone());
    }

    let palette = [
        "#e74c3c", "#2980b9", "#27ae60", "#f39c12", "#8e44ad",
        "#1abc9c", "#d35400", "#c0392b", "#2c3e50", "#16a085",
        "#e67e22", "#9b59b6", "#3498db", "#e91e63",
    ];
    let mut communities: Vec<Community> = Vec::new();
    for ci in 0..num_communities {
        let members = &community_members[ci];
        let best_member = members.iter()
            .max_by(|a, b| {
                let da = id_to_idx.get(a.as_str()).map(|&i| k[i]).unwrap_or(0.0);
                let db = id_to_idx.get(b.as_str()).map(|&i| k[i]).unwrap_or(0.0);
                da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
            })
            .unwrap();
        let best_idx = id_to_idx[best_member.as_str()];
        let auto_label = format!("{} cluster", nodes[best_idx].label);

        communities.push(Community {
            id: ci,
            label: auto_label,
            members: members.clone(),
            color: palette[ci % palette.len()].to_string(),
        });
    }

    // Apply overrides from communities.toml
    for ov in overrides {
        if let Some(c) = communities.iter_mut().find(|c| c.id.to_string() == ov.id) {
            c.label.clone_from(&ov.label);
            if let Some(ref color) = ov.color {
                c.color.clone_from(color);
            }
        } else if !ov.members.is_empty() {
            if let Some(c) = communities.iter_mut().find(|c| {
                ov.members.iter().all(|m| c.members.contains(m))
            }) {
                c.label.clone_from(&ov.label);
                if let Some(ref color) = ov.color {
                    c.color.clone_from(color);
                }
            }
        }
    }

    communities
}

// ── JavaScript output ───────────────────────────────────────────────────

fn js_string(s: &str) -> String {
    s.replace('\\', "\\\\").replace('\'', "\\'")
}

fn write_js_nodes(out: &mut String, nodes: &[VizNode]) {
    out.push_str("  var NODES = [\n");
    for n in nodes {
        out.push_str(&format!(
            "    {{ id: '{}', label: '{}', tier: {}, type: '{}',\n",
            js_string(&n.id), js_string(&n.label), n.tier, js_string(&n.node_type)
        ));
        out.push_str(&format!(
            "      detail: '{}', url: {},\n",
            js_string(&n.detail),
            n.url.as_ref().map_or("null".to_string(), |u| format!("'{}'", js_string(u)))
        ));
        let nexus_str: Vec<String> = n.nexus.iter().map(|s| format!("'{}'", js_string(s))).collect();
        out.push_str(&format!("      nexus: [{}],\n", nexus_str.join(", ")));
        out.push_str(&format!(
            "      dynasty: {}, era: {}, community: {} }},\n",
            n.dynasty.as_ref().map_or("null".to_string(), |d| format!("'{}'", js_string(d))),
            n.era.as_ref().map_or("null".to_string(), |e| format!("'{}'", js_string(e))),
            n.community
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_edges(out: &mut String, edges: &[VizEdge]) {
    out.push_str("\n  var EDGES = [\n");
    for e in edges {
        out.push_str(&format!(
            "    {{ source: '{}', target: '{}', type: '{}', label: '{}', flow: '{}', amount: {} }},\n",
            js_string(&e.source), js_string(&e.target), js_string(&e.edge_type),
            js_string(&e.label), js_string(&e.flow),
            e.amount.map_or("null".to_string(), |a| {
                if a == 0.0 { "null".to_string() }
                else if a == a.floor() { format!("{}", a as i64) }
                else { format!("{a}") }
            })
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_ownership_groups(out: &mut String, groups: &[OwnershipGroup]) {
    out.push_str("\n  var OWNERSHIP_GROUPS = [\n");
    for g in groups {
        let members: Vec<String> = g.members.iter().map(|m| format!("'{}'", js_string(m))).collect();
        out.push_str(&format!(
            "    {{\n      id: '{}',\n      controller: {},\n      label: '{}',\n",
            js_string(&g.id),
            g.controller.as_ref().map_or("null".to_string(), |c| format!("'{}'", js_string(c))),
            js_string(&g.label)
        ));
        out.push_str(&format!(
            "      members: [{}],\n      color: '{}',\n      stroke: '{}',\n      note: '{}'\n    }},\n",
            members.join(", "), js_string(&g.color), js_string(&g.stroke), js_string(&g.note)
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_address_clusters(out: &mut String, clusters: &[AddressCluster]) {
    out.push_str("\n  var ADDRESS_CLUSTERS = [\n");
    for c in clusters {
        let members: Vec<String> = c.members.iter().map(|m| format!("'{}'", js_string(m))).collect();
        out.push_str(&format!(
            "    {{\n      id: '{}',\n      address: '{}',\n      label: '{}',\n",
            js_string(&c.id), js_string(&c.address), js_string(&c.label)
        ));
        out.push_str(&format!(
            "      members: [{}],\n      color: '{}',\n      stroke: '{}',\n      note: '{}'\n    }},\n",
            members.join(", "), js_string(&c.color), js_string(&c.stroke), js_string(&c.note)
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_oversight_cycles(out: &mut String, cycles: &[OversightCycle]) {
    out.push_str("\n  var OVERSIGHT_CYCLES = [\n");
    for c in cycles {
        let path: Vec<String> = c.path.iter().map(|p| format!("'{}'", js_string(p))).collect();
        out.push_str(&format!(
            "    {{ id: '{}', label: '{}',\n      path: [{}],\n      note: '{}' }},\n",
            js_string(&c.id), js_string(&c.label), path.join(", "), js_string(&c.note)
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_communities(out: &mut String, communities: &[Community]) {
    out.push_str("\n  var COMMUNITIES = [\n");
    for c in communities {
        let members: Vec<String> = c.members.iter().map(|m| format!("'{}'", js_string(m))).collect();
        out.push_str(&format!(
            "    {{ id: {}, label: '{}',\n      members: [{}],\n      color: '{}' }},\n",
            c.id, js_string(&c.label), members.join(", "), js_string(&c.color)
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_benches(out: &mut String, benches: &[Bench]) {
    out.push_str("\n  var BENCHES = [\n");
    for b in benches {
        let captured: Vec<String> = b.captured_judges.iter()
            .map(|j| format!("'{}'", js_string(j)))
            .collect();
        let case_types: Vec<String> = b.case_types.iter()
            .map(|t| format!("'{}'", js_string(t)))
            .collect();
        let capture_ratio = if b.total_judges > 0 {
            b.captured_judges.len() as f64 / b.total_judges as f64
        } else {
            0.0
        };
        out.push_str(&format!(
            "    {{ id: '{}', court: '{}', division: '{}', label: '{}',\n",
            js_string(&b.id), js_string(&b.court),
            js_string(&b.division), js_string(&b.label)
        ));
        out.push_str(&format!(
            "      totalJudges: {}, capturedJudges: [{}],\n",
            b.total_judges, captured.join(", ")
        ));
        out.push_str(&format!(
            "      caseTypes: [{}],\n",
            case_types.join(", ")
        ));
        out.push_str(&format!(
            "      captureRatio: {:.4}, retired: {},\n      note: '{}' }},\n",
            capture_ratio, b.retired, js_string(&b.note)
        ));
    }
    out.push_str("  ];\n");

    // Compute lattice paths: for each case type, which benches handle it?
    let mut case_type_set: BTreeSet<&str> = BTreeSet::new();
    for b in benches {
        for ct in &b.case_types {
            case_type_set.insert(ct.as_str());
        }
    }
    out.push_str("\n  var LATTICE_PATHS = {\n");
    for ct in &case_type_set {
        let bench_ids: Vec<String> = benches.iter()
            .filter(|b| !b.retired && b.case_types.iter().any(|t| t == ct))
            .map(|b| format!("'{}'", js_string(&b.id)))
            .collect();
        // Probability of hitting a captured judge for this case type
        let active_benches: Vec<&Bench> = benches.iter()
            .filter(|b| !b.retired && b.case_types.iter().any(|t| t == ct))
            .collect();
        let total_judges: u32 = active_benches.iter().map(|b| b.total_judges).sum();
        let captured_count: usize = active_benches.iter()
            .map(|b| b.captured_judges.len())
            .sum();
        let capture_prob = if total_judges > 0 {
            captured_count as f64 / total_judges as f64
        } else {
            0.0
        };
        // Localization length: -1 / ln(1 - capture_prob)
        let loc_length = if capture_prob > 0.0 && capture_prob < 1.0 {
            -1.0 / (1.0 - capture_prob).ln()
        } else if capture_prob >= 1.0 {
            0.0
        } else {
            f64::INFINITY
        };
        let loc_str = if loc_length.is_infinite() {
            "Infinity".to_string()
        } else {
            format!("{:.2}", loc_length)
        };
        out.push_str(&format!(
            "    '{}': {{ benches: [{}], captureProb: {:.4}, localizationLength: {} }},\n",
            js_string(ct), bench_ids.join(", "), capture_prob, loc_str
        ));
    }
    out.push_str("  };\n");
}

fn write_js_geo(out: &mut String, geo: &GeoFile) {
    // Positions
    out.push_str("\n  var GEO_POSITIONS = {\n");
    for (id, pos) in &geo.positions {
        let padding = " ".repeat(18usize.saturating_sub(id.len()));
        out.push_str(&format!(
            "    {id}:{padding}{{ px: {:.2}, py: {:.2} }},\n",
            pos.px, pos.py
        ));
    }
    out.push_str("  };\n");

    // Aggregates
    out.push_str("\n  var GEO_AGGREGATES = [\n");
    for a in &geo.aggregate {
        let aggs: Vec<String> = a.aggregates.iter().map(|s| format!("'{}'", js_string(s))).collect();
        out.push_str(&format!(
            "    {{ id: '{}', label: '{}', type: '{}',\n      px: {:.2}, py: {:.2},\n      detail: '{}',\n      aggregates: [{}] }},\n",
            js_string(&a.id), js_string(&a.label), js_string(&a.agg_type),
            a.px, a.py, js_string(&a.detail), aggs.join(", ")
        ));
    }
    out.push_str("  ];\n");

    // Flows
    out.push_str("\n  var GEO_FLOWS = [\n");
    for f in &geo.flow {
        let amount_str = if f.amount == 0.0 {
            "0".to_string()
        } else if f.amount == f.amount.floor() {
            format!("{}", f.amount as i64)
        } else {
            format!("{}", f.amount)
        };
        out.push_str(&format!(
            "    {{ from: '{}', to: '{}', flow_type: '{}',\n      label: '{}', amount: {} }},\n",
            js_string(&f.from), js_string(&f.to), js_string(&f.flow_type),
            js_string(&f.label), amount_str
        ));
    }
    out.push_str("  ];\n");
}

fn write_js_display_constants(out: &mut String) {
    out.push_str(r#"
  var NODE_COLORS = {
    actor: '#c0392b',
    judge: '#8e44ad',
    political: '#2980b9',
    bmf: '#e74c3c',
    school: '#27ae60',
    entity: '#f39c12',
    institutional: '#7f8c8d',
  };

  var EDGE_COLORS = {
    controls: '#95a5a6',
    financial: '#f39c12',
    associate: '#e74c3c',
    money: '#27ae60',
    judicial: '#8e44ad',
    political: '#2980b9',
    family: '#c0392b',
    institutional: '#7f8c8d',
  };

  var NEXUS_COLORS = {
    education: '#27ae60',
    political: '#2980b9',
    enforcement: '#e74c3c',
    weaponization: '#c0392b',
    legislative: '#f39c12',
  };

  var FLOW_COLORS = {
    money: '#2ecc71',
    power: '#e74c3c',
    influence: '#3498db',
    position: '#9b59b6',
  };

  var FLOW_ICONS = {
    money: '💰',
    power: '⚡',
    influence: '🤝',
    position: '🪑',
  };

  var GEO_TYPE_COLORS = {
    school: '#27ae60',
    extraction: '#e74c3c',
    political: '#2980b9',
    court: '#8e44ad',
    state: '#7f8c8d',
    vendor: '#f39c12',
  };

  var GEO_FLOW_STYLES = {
    state_aid:     { color: '#27ae60', width: 4, dash: '' },
    extraction:    { color: '#e74c3c', width: 4, dash: '' },
    personal:      { color: '#c0392b', width: 3, dash: '' },
    campaign:      { color: '#f39c12', width: 2.5, dash: '6,3' },
    authorization: { color: '#1abc9c', width: 2, dash: '4,2' },
    kickback:      { color: '#8e44ad', width: 2.5, dash: '3,3' },
    dark_money:    { color: '#e74c3c', width: 2, dash: '2,4' },
    property:      { color: '#d35400', width: 2.5, dash: '8,3' },
    donation:      { color: '#2980b9', width: 2, dash: '5,3' },
    oversight:     { color: '#7f8c8d', width: 1.5, dash: '3,6' },
    events:        { color: '#e67e22', width: 2, dash: '4,4' },
    formation:     { color: '#e74c3c', width: 3, dash: '2,2' },
    self_dealing:  { color: '#d35400', width: 3, dash: '3,2' },
    endorsement:   { color: '#2980b9', width: 2, dash: '4,3' },
    money_in:      { color: '#27ae60', width: 4, dash: '' },
    money_out:     { color: '#e74c3c', width: 4, dash: '' },
    influence:     { color: '#3498db', width: 2, dash: '4,4' },
  };
"#);
}

fn write_js_matrix_functions(out: &mut String) {
    out.push_str(r#"
  function buildNodeIndex(nodes) {
    var idx = {};
    nodes.forEach(function(n, i) { idx[n.id] = i; });
    return idx;
  }

  function adjacencyMap(nodes, edges) {
    var adj = {};
    nodes.forEach(function(n) { adj[n.id] = []; });
    edges.forEach(function(e) {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (adj[e.target]) adj[e.target].push(e.source);
    });
    return adj;
  }

  function flowMatrix(edges) {
    var matrix = {};
    edges.forEach(function(e) {
      if (!matrix[e.source]) matrix[e.source] = {};
      if (!matrix[e.source][e.target]) matrix[e.source][e.target] = [];
      matrix[e.source][e.target].push({
        type: e.type, flow: e.flow, label: e.label, amount: e.amount
      });
    });
    return matrix;
  }

  function degreeVector(nodes, edges) {
    var deg = {};
    nodes.forEach(function(n) { deg[n.id] = 0; });
    edges.forEach(function(e) {
      if (deg[e.source] !== undefined) deg[e.source]++;
      if (deg[e.target] !== undefined) deg[e.target]++;
    });
    return deg;
  }

  function flowSummary(nodeId, edges) {
    var inflows = { money: 0, power: 0, influence: 0, position: 0 };
    var outflows = { money: 0, power: 0, influence: 0, position: 0 };
    var totalIn = 0, totalOut = 0;
    edges.forEach(function(e) {
      if (e.target === nodeId && inflows[e.flow] !== undefined) {
        inflows[e.flow]++;
        if (e.amount) totalIn += e.amount;
      }
      if (e.source === nodeId && outflows[e.flow] !== undefined) {
        outflows[e.flow]++;
        if (e.amount) totalOut += e.amount;
      }
    });
    return { inflows: inflows, outflows: outflows, totalDollarsIn: totalIn, totalDollarsOut: totalOut };
  }

  function moneyTrail(edges) {
    return edges
      .filter(function(e) { return e.flow === 'money' && e.amount; })
      .sort(function(a, b) { return (b.amount || 0) - (a.amount || 0); });
  }

  function findCycles(edges, maxLen) {
    maxLen = maxLen || 5;
    var adj = {};
    edges.forEach(function(e) {
      if (!adj[e.source]) adj[e.source] = [];
      adj[e.source].push(e.target);
    });
    var cycles = [];
    var visited = {};
    function dfs(start, path) {
      var current = path[path.length - 1];
      if (path.length > maxLen) return;
      var neighbors = adj[current] || [];
      for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i] === start && path.length >= 3) {
          cycles.push(path.concat([start]));
        } else if (!visited[neighbors[i]] && path.indexOf(neighbors[i]) === -1) {
          dfs(start, path.concat([neighbors[i]]));
        }
      }
    }
    Object.keys(adj).forEach(function(node) {
      visited = {};
      dfs(node, [node]);
      visited[node] = true;
    });
    return cycles;
  }
"#);
}

fn write_js_export(out: &mut String, version: u32) {
    out.push_str(&format!(r#"
  var network = {{
    nodes: NODES,
    edges: EDGES,
    communities: COMMUNITIES,
    ownershipGroups: OWNERSHIP_GROUPS,
    addressClusters: ADDRESS_CLUSTERS,
    oversightCycles: OVERSIGHT_CYCLES,
    geoPositions: GEO_POSITIONS,
    geoAggregates: GEO_AGGREGATES,
    geoFlows: GEO_FLOWS,
    nodeColors: NODE_COLORS,
    edgeColors: EDGE_COLORS,
    nexusColors: NEXUS_COLORS,
    flowColors: FLOW_COLORS,
    flowIcons: FLOW_ICONS,
    geoTypeColors: GEO_TYPE_COLORS,
    geoFlowStyles: GEO_FLOW_STYLES,
    benches: BENCHES,
    latticePaths: LATTICE_PATHS,
    graphData: function() {{
      return {{ nodes: NODES, links: EDGES }};
    }},
    nodeIndex: function() {{ return buildNodeIndex(NODES); }},
    adjacency: function() {{ return adjacencyMap(NODES, EDGES); }},
    flowMatrix: function() {{ return flowMatrix(EDGES); }},
    degrees: function() {{ return degreeVector(NODES, EDGES); }},
    flowSummary: function(nodeId) {{ return flowSummary(nodeId, EDGES); }},
    moneyTrail: function() {{ return moneyTrail(EDGES); }},
    findCycles: function(maxLen) {{ return findCycles(EDGES, maxLen); }},
    stats: function() {{
      var flowCounts = {{ money: 0, power: 0, influence: 0, position: 0 }};
      var totalDocumented = 0;
      EDGES.forEach(function(e) {{
        if (flowCounts[e.flow] !== undefined) flowCounts[e.flow]++;
        if (e.amount) totalDocumented += e.amount;
      }});
      return {{
        nodeCount: NODES.length,
        edgeCount: EDGES.length,
        ownershipGroupCount: OWNERSHIP_GROUPS.length,
        cycleCount: OVERSIGHT_CYCLES.length,
        flowCounts: flowCounts,
        totalDocumentedDollars: totalDocumented,
        nexusTypes: ['education', 'political', 'enforcement', 'weaponization', 'legislative'],
      }};
    }},
    version: {version},
  }};

  window.DETROIT_NETWORK = network;
"#));
}

// ── Public API ──────────────────────────────────────────────────────────

pub fn generate(
    config: &Config,
    edges: &[GraphEdge],
    data_dir: &Path,
    static_dir: &Path,
) -> Result<(usize, usize), Box<dyn std::error::Error>> {
    // Load overlay data
    let ownership_groups: Vec<OwnershipGroup> = {
        let path = data_dir.join("ownership-groups.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            let parsed: OwnershipGroupsFile = toml::from_str(&text)?;
            parsed.group
        } else {
            Vec::new()
        }
    };

    let address_clusters: Vec<AddressCluster> = {
        let path = data_dir.join("address-clusters.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            let parsed: AddressClustersFile = toml::from_str(&text)?;
            parsed.cluster
        } else {
            Vec::new()
        }
    };

    let oversight_cycles: Vec<OversightCycle> = {
        let path = data_dir.join("oversight-cycles.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            let parsed: OversightCyclesFile = toml::from_str(&text)?;
            parsed.cycle
        } else {
            Vec::new()
        }
    };

    let geo: GeoFile = {
        let path = data_dir.join("geo.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            toml::from_str(&text)?
        } else {
            GeoFile {
                positions: BTreeMap::new(),
                aggregate: Vec::new(),
                flow: Vec::new(),
            }
        }
    };

    let benches: Vec<Bench> = {
        let path = data_dir.join("benches.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            let parsed: BenchFile = toml::from_str(&text)?;
            parsed.bench
        } else {
            Vec::new()
        }
    };

    let community_overrides: Vec<CommunityOverride> = {
        let path = data_dir.join("communities.toml");
        if path.exists() {
            let text = std::fs::read_to_string(&path)?;
            let parsed: CommunitiesFile = toml::from_str(&text)?;
            parsed.community
        } else {
            Vec::new()
        }
    };

    // Resolve nodes and edges
    let mut nodes = resolve_nodes(config, edges);
    let node_ids: BTreeSet<String> = nodes.iter().map(|n| n.id.clone()).collect();
    let viz_edges = resolve_edges(edges, &node_ids);

    // Run Louvain community detection
    let communities = compute_communities(&mut nodes, &viz_edges, &community_overrides);

    // Generate JavaScript
    let mut out = String::with_capacity(64 * 1024);

    out.push_str("// network-data.js — generated by detroit-build from TOML registries\n");
    out.push_str(&format!(
        "// Generated: {}\n",
        chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ")
    ));
    out.push_str("// Source: config.toml + edges.toml + overlay TOMLs\n");
    out.push_str("// Zero dependencies. No tracking. Pure data.\n\n");
    out.push_str("(function() {\n  'use strict';\n\n");

    write_js_nodes(&mut out, &nodes);
    write_js_edges(&mut out, &viz_edges);
    write_js_communities(&mut out, &communities);
    write_js_ownership_groups(&mut out, &ownership_groups);
    write_js_address_clusters(&mut out, &address_clusters);
    write_js_oversight_cycles(&mut out, &oversight_cycles);
    write_js_benches(&mut out, &benches);
    write_js_geo(&mut out, &geo);
    write_js_display_constants(&mut out);
    write_js_matrix_functions(&mut out);
    write_js_export(&mut out, 7);

    out.push_str("})();\n");

    // Write output
    let js_dir = static_dir.join("js");
    std::fs::create_dir_all(&js_dir)?;
    let output_path = js_dir.join("network-data.js");
    std::fs::write(&output_path, &out)?;

    Ok((nodes.len(), viz_edges.len()))
}
