//! Cross-layer consistency checks — uses litho_core::report for diagnostics.

use crate::content::{Page, Section};
use crate::graph::{GraphEdge, GraphNode};
use crate::registry::Config;
use litho_core::report::Report;
use std::collections::{BTreeMap, BTreeSet};

pub fn verify_all(
    reg: &Config,
    sections: &BTreeMap<String, Section>,
    pages: &[Page],
    nodes: &[GraphNode],
    edges: &[GraphEdge],
) -> Report {
    let mut report = Report::new();
    let page_urls: BTreeSet<&str> = pages.iter().map(|p| p.url.as_str()).collect();

    // Actor page resolution
    let mut actor_pages = 0u32;
    for (key, actor) in &reg.actors {
        if !actor.page.is_empty() {
            if page_urls.contains(actor.page.as_str()) {
                actor_pages += 1;
            } else {
                report.warn(format!(
                    "Actor \"{key}\" page {} not found in content",
                    actor.page
                ));
            }
        }
    }

    // Entity page resolution
    let mut entity_pages = 0u32;
    for (key, entity) in &reg.entities {
        if !entity.page.is_empty() {
            if page_urls.contains(entity.page.as_str()) {
                entity_pages += 1;
            } else {
                report.warn(format!(
                    "Entity \"{key}\" page {} not found in content",
                    entity.page
                ));
            }
        }
    }

    // Graph node → registry check
    let registry_ids: BTreeSet<&str> = reg
        .actors
        .keys()
        .chain(reg.entities.keys())
        .map(String::as_str)
        .collect();
    for n in nodes {
        if !registry_ids.contains(n.id.as_str()) && n.node_type != "institution" {
            report.warn(format!(
                "Graph node \"{}\" not in config.toml registries",
                n.id
            ));
        }
    }

    // Edge endpoint validation
    let node_ids: BTreeSet<&str> = nodes.iter().map(|n| n.id.as_str()).collect();
    let edge_pairs: Vec<(String, String)> = edges
        .iter()
        .map(|e| (e.source.clone(), e.target.clone()))
        .collect();
    for err in litho_core::graph::validate_endpoints(&node_ids, &edge_pairs) {
        report.error(err);
    }

    // Page description check
    for p in pages {
        if p.description.is_empty() {
            report.warn(format!("Page {} has no description", p.url));
        }
    }

    // Stats
    report.info(format!(
        "Actors: {} registered, {actor_pages} with pages",
        reg.actors.len()
    ));
    report.info(format!(
        "Entities: {} registered, {entity_pages} with pages",
        reg.entities.len()
    ));
    report.info(format!("Sources: {} registered", reg.sources.len()));
    report.info(format!("Graph: {} nodes, {} edges", nodes.len(), edges.len()));
    report.info(format!(
        "Content: {} sections, {} pages",
        sections.len(),
        pages.len()
    ));

    report
}
