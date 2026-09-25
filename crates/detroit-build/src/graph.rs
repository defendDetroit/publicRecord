//! Build graph.json from config.toml registries + data/edges.toml.

use crate::registry::Config;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;

// ── Edge types ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EpistemicStatus {
    Record,
    Corroborated,
    Inference,
    Allegation,
    Filed,
    Adjudicated,
    Corrected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphEdge {
    pub source: String,
    pub target: String,
    #[serde(rename = "type")]
    pub edge_type: String,
    pub epistemic_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<String>,
}

// ── Node types ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct GraphNode {
    pub id: String,
    pub label: String,
    #[serde(rename = "type")]
    pub node_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lara_id: Option<String>,
}

// ── Graph JSON structure ────────────────────────────────────────────────

#[derive(Debug, Serialize)]
pub struct GraphJson {
    pub _generated: String,
    pub _source: String,
    pub nodes: Vec<GraphNode>,
    pub edges: Vec<GraphEdge>,
    pub epistemic_grammar: EpistemicGrammar,
}

#[derive(Debug, Serialize)]
pub struct EpistemicGrammar {
    pub description: String,
    pub statuses: BTreeMap<String, String>,
}

// ── Parse edges.toml ────────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct EdgesFile {
    edge: Vec<GraphEdge>,
}

pub fn parse_edges(path: &Path) -> Result<Vec<GraphEdge>, Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string(path)?;
    let parsed: EdgesFile = toml::from_str(&text)?;
    Ok(parsed.edge)
}

// ── Build nodes from registries ─────────────────────────────────────────

pub fn build_nodes(config: &Config, edges: &[GraphEdge]) -> (Vec<GraphNode>, Vec<GraphEdge>) {
    let mut nodes = Vec::new();
    let mut node_ids = BTreeSet::new();

    for (key, actor) in &config.actors {
        nodes.push(GraphNode {
            id: key.clone(),
            label: actor.display.clone(),
            node_type: "actor".to_string(),
            tier: Some(actor.tier),
            role: Some(actor.role.clone()).filter(|s| !s.is_empty()),
            page: Some(actor.page.clone()).filter(|s| !s.is_empty()),
            entity_type: None,
            lara_id: None,
        });
        node_ids.insert(key.clone());
    }

    for (key, entity) in &config.entities {
        nodes.push(GraphNode {
            id: key.clone(),
            label: entity.display.clone(),
            node_type: "entity".to_string(),
            tier: None,
            role: None,
            page: Some(entity.page.clone()).filter(|s| !s.is_empty()),
            entity_type: Some(entity.entity_type.clone()).filter(|s| !s.is_empty()),
            lara_id: entity.lara_id.clone(),
        });
        node_ids.insert(key.clone());
    }

    // Add institutional nodes referenced in edges but not in registries
    let mut institutional = BTreeSet::new();
    for e in edges {
        if !node_ids.contains(&e.source) {
            institutional.insert(e.source.clone());
        }
        if !node_ids.contains(&e.target) {
            institutional.insert(e.target.clone());
        }
    }
    for nid in &institutional {
        nodes.push(GraphNode {
            id: nid.clone(),
            label: nid.replace('_', " ").to_string(),
            node_type: "institution".to_string(),
            tier: None,
            role: None,
            page: None,
            entity_type: None,
            lara_id: None,
        });
        node_ids.insert(nid.clone());
    }

    // Validate and collect edges
    let mut valid_edges = Vec::new();
    for e in edges {
        if !node_ids.contains(&e.source) {
            eprintln!("  \u{26a0}\u{fe0f}  Edge source \"{}\" not in any registry", e.source);
        }
        if !node_ids.contains(&e.target) {
            eprintln!("  \u{26a0}\u{fe0f}  Edge target \"{}\" not in any registry", e.target);
        }
        valid_edges.push(e.clone());
    }

    (nodes, valid_edges)
}

// ── Write graph.json + graph.csv ────────────────────────────────────────

pub fn write_graph(
    static_dir: &Path,
    nodes: &[GraphNode],
    edges: &[GraphEdge],
) -> Result<(), Box<dyn std::error::Error>> {
    let now = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();

    let mut statuses = BTreeMap::new();
    statuses.insert("record".into(), "Verifiable public record.".into());
    statuses.insert("corroborated".into(), "Independently confirmed by 2+ sources.".into());
    statuses.insert("inference".into(), "Analytical conclusion drawn from records.".into());
    statuses.insert("allegation".into(), "Formally alleged in complaint.".into());
    statuses.insert("filed".into(), "Submitted to agency/court.".into());
    statuses.insert("adjudicated".into(), "Determined by court or agency.".into());
    statuses.insert("corrected".into(), "Previously published claim corrected.".into());

    let graph = GraphJson {
        _generated: now,
        _source: "Built by detroit-build from config.toml + data/edges.toml".to_string(),
        nodes: nodes.to_vec(),
        edges: edges.to_vec(),
        epistemic_grammar: EpistemicGrammar {
            description: "Every edge carries an epistemic status classifying the nature of the claim.".to_string(),
            statuses,
        },
    };

    let json = serde_json::to_string_pretty(&graph)?;
    std::fs::write(static_dir.join("graph.json"), &json)?;

    // CSV
    let node_labels: BTreeMap<&str, &str> = nodes
        .iter()
        .map(|n| (n.id.as_str(), n.label.as_str()))
        .collect();

    let mut wtr = csv::Writer::from_writer(Vec::new());
    wtr.write_record([
        "source_id", "source_label", "target_id", "target_label",
        "edge_type", "epistemic_status", "role", "amount_usd",
        "note", "weight", "source_doc",
    ])?;
    for e in edges {
        wtr.write_record([
            &e.source,
            node_labels.get(e.source.as_str()).copied().unwrap_or(e.source.as_str()),
            &e.target,
            node_labels.get(e.target.as_str()).copied().unwrap_or(e.target.as_str()),
            &e.edge_type,
            &e.epistemic_status,
            e.role.as_deref().unwrap_or(""),
            e.amount.as_deref().unwrap_or(""),
            e.note.as_deref().unwrap_or(""),
            &e.weight.map_or(String::new(), |w| w.to_string()),
            e.source_doc.as_deref().unwrap_or(""),
        ])?;
    }
    let csv_data = String::from_utf8(wtr.into_inner()?)?;
    std::fs::write(static_dir.join("graph.csv"), csv_data)?;

    Ok(())
}
