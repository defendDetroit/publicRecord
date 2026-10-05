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
            "      dynasty: {}, era: {} }},\n",
            n.dynasty.as_ref().map_or("null".to_string(), |d| format!("'{}'", js_string(d))),
            n.era.as_ref().map_or("null".to_string(), |e| format!("'{}'", js_string(e)))
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

    // Resolve nodes and edges
    let nodes = resolve_nodes(config, edges);
    let node_ids: BTreeSet<String> = nodes.iter().map(|n| n.id.clone()).collect();
    let viz_edges = resolve_edges(edges, &node_ids);

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
    write_js_ownership_groups(&mut out, &ownership_groups);
    write_js_address_clusters(&mut out, &address_clusters);
    write_js_oversight_cycles(&mut out, &oversight_cycles);
    write_js_geo(&mut out, &geo);
    write_js_display_constants(&mut out);
    write_js_matrix_functions(&mut out);
    write_js_export(&mut out, 5);

    out.push_str("})();\n");

    // Write output
    let js_dir = static_dir.join("js");
    std::fs::create_dir_all(&js_dir)?;
    let output_path = js_dir.join("network-data.js");
    std::fs::write(&output_path, &out)?;

    Ok((nodes.len(), viz_edges.len()))
}
