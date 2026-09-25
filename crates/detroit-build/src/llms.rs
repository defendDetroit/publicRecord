//! Generate llms.txt (template + auto-generated) and llms-full.txt (content dump).

use crate::content::{Page, Section};
use crate::graph::{GraphEdge, GraphNode};
use crate::registry::Config;
use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;
use litho_core::frontmatter;

const BASE_URL: &str = "https://detroit.primals.eco";

/// Build llms.txt from editorial template + auto-generated sections.
pub fn build_llms_txt(
    reg: &Config,
    sections: &BTreeMap<String, Section>,
    pages: &[Page],
    nodes: &[GraphNode],
    edges: &[GraphEdge],
    data_dir: &Path,
    static_dir: &Path,
) -> Result<(), Box<dyn std::error::Error>> {
    let template = std::fs::read_to_string(data_dir.join("llms-editorial.md"))?;
    let today = chrono::Utc::now().format("%Y-%m-%d").to_string();

    // Count taxonomies
    let mut all_tax: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    for p in pages {
        for (tax, terms) in &p.taxonomies {
            for term in terms {
                all_tax.entry(tax.clone()).or_default().insert(term.clone());
            }
        }
    }
    let tax_count: usize = all_tax.values().map(BTreeSet::len).sum();
    let tax_stats = format!("{tax_count} term assignments across {} pages", pages.len());

    // HEADER
    let header = format!(
        "# detroit.primals.eco \u{2014} Public Evidence Library\n\
         # Canonical URL: {BASE_URL}/llms.txt\n\
         # Last updated: {today}\n\
         #\n\
         # CONTEXT DOCUMENT for AI agents acting on behalf of users.\n\
         # This is the site's glossary, index, and topology map \u{2014} not a page.\n\
         # Intake this once to understand the full site structure, then fetch\n\
         # individual pages by URL for specific content.\n\
         #\n\
         # Every page links here via <link rel=\"describedby\"> \u{2014} that means\n\
         # \"this resource describes the site context,\" NOT \"this is the page\n\
         # content in text format.\" The page you want is at the URL you requested.\n\
         #\n\
         # Static site API: {BASE_URL}/api/site.json (structure, pages, taxonomies)\n\
         # Full content dump: {BASE_URL}/llms-full.txt\n\
         # Content manifest: {BASE_URL}/content-manifest.toml\n\
         # Network graph (JSON): {BASE_URL}/graph.json ({} nodes, {} edges)\n\
         # Network graph (CSV): {BASE_URL}/graph.csv (edge list for Gephi/pandas/R)",
        nodes.len(), edges.len()
    );

    // WHAT'S NEW
    let whats_new = format!(
        "## What's New ({today})\n\n\
         - Federal master packet delivered to 8 federal agencies (Sep 22)\n\
         - PCA Board of Directors roster documented: Assistant AG Lamar Moreland\n\
         \x20 (Vice Chair), City Council Member Latisha Johnson (Secretary) serve\n\
         \x20 alongside Judge Cylenthia Miller (Chair) on a felon's school board\n\
         - Clutch Justice elevated to primary analytical reference (3-tier hierarchy)\n\
         - Epistemic grammar system: every claim carries machine-readable status\n\
         \x20 (record / corroborated / inference / allegation / filed / adjudicated)\n\
         - Static site API at /api/site.json \u{2014} full site structure in one fetch\n\
         - {} content pages, {} sections, {} graph nodes, {} graph edges",
        pages.len(), sections.len(), nodes.len(), edges.len()
    );

    // CASE STATUS
    let case_status = "## Active Case Status\n\n\
        | Case | Status | Court/Agency |\n\
        |------|--------|-------------|\n\
        | Federal packet (8 agencies) | Delivered Sep 22 | DOJ, FBI, IRS, ED-OIG, FTC, SEC, USED, FinCEN |\n\
        | Ingham County 2026-4349-CZ | Filed Sep 1 | Ingham County Circuit |\n\
        | PPO (Banks) | Hearing Sep 29 | Wayne County |\n\
        | DPSCD complaint | Filed Aug 31 | Detroit Public Schools |\n\
        | State Bar UPL complaint | Filed Aug 31 | State Bar of Michigan |\n\
        | JTC complaint | Filed Aug 31 | Judicial Tenure Commission |\n\
        | Michigan Court of Claims | Planned Oct 2026 | State of Michigan |\n\
        | Federal \u{00a7} 1983 + RICO | Planned Oct 2026 | E.D. Michigan |"
        .to_string();

    // SITE STRUCTURE (auto-generated)
    let mut sitemap_lines = vec![format!(
        "## Site Structure ({} content files)\n",
        pages.len() + sections.len()
    )];
    let mut section_pages: BTreeMap<String, Vec<&Page>> = BTreeMap::new();
    for p in pages {
        section_pages.entry(p.section.clone()).or_default().push(p);
    }
    for (sec_path, sec) in sections {
        if sec_path == "/" {
            sitemap_lines.push("### Root".to_string());
            let desc = &sec.description[..sec.description.len().min(80)];
            sitemap_lines.push(format!("- [Home]({BASE_URL}/) \u{2014} {desc}"));
            continue;
        }
        let depth = sec_path.trim_matches('/').matches('/').count() + 1;
        let prefix = "#".repeat(depth.min(4) + 2);
        sitemap_lines.push(format!("\n{prefix} {} ({sec_path})", sec.title));
        if let Some(spages) = section_pages.get(sec_path) {
            let mut sorted = spages.clone();
            sorted.sort_by_key(|p| p.weight.unwrap_or(99));
            for p in sorted {
                let short = p.title.split(" \u{2014} ").next().unwrap_or(&p.title);
                let desc = &p.description[..p.description.len().min(100)];
                sitemap_lines.push(format!("- [{short}]({BASE_URL}{}) \u{2014} {desc}", p.url));
            }
        }
    }

    // KEY ENTITIES (auto-generated)
    let mut entity_lines = vec![
        "## Key Entities Quick Reference\n".to_string(),
        "| Entity | Role | Key Fact |".to_string(),
        "|--------|------|----------|".to_string(),
    ];
    let mut actors: Vec<(&String, &crate::registry::Actor)> = reg.actors.iter().collect();
    actors.sort_by_key(|(_, a)| a.tier);
    for (_, a) in actors {
        let conn = a
            .connection
            .as_deref()
            .or(a.convictions.as_deref())
            .unwrap_or("");
        let conn_short = &conn[..conn.len().min(60)];
        entity_lines.push(format!("| {} | {} | {conn_short} |", a.display, a.role));
    }

    // Assemble
    let mut output = template;
    output = output.replace("{{HEADER}}", &header);
    output = output.replace("{{WHATS_NEW}}", &whats_new);
    output = output.replace("{{CASE_STATUS}}", &case_status);
    output = output.replace("{{TAXONOMY_STATS}}", &tax_stats);
    output = output.replace("{{SOURCE_COUNT}}", &reg.sources.len().to_string());
    output = output.replace("{{ACTOR_COUNT}}", &reg.actors.len().to_string());
    output = output.replace("{{ENTITY_COUNT}}", &reg.entities.len().to_string());
    output = output.replace("{{NODE_COUNT}}", &nodes.len().to_string());
    output = output.replace("{{EDGE_COUNT}}", &edges.len().to_string());
    output = output.replace("{{SITE_STRUCTURE}}", &sitemap_lines.join("\n"));
    output = output.replace("{{KEY_ENTITIES}}", &entity_lines.join("\n"));

    std::fs::write(static_dir.join("llms.txt"), &output)?;
    println!(
        "  \u{2705} llms.txt: {} chars, {} actors, {} entities, {} sources",
        output.len(),
        reg.actors.len(),
        reg.entities.len(),
        reg.sources.len()
    );
    Ok(())
}

/// Build llms-full.txt — complete content dump.
pub fn build_llms_full(
    content_dir: &Path,
    root: &Path,
    static_dir: &Path,
    nodes: &[GraphNode],
    edges: &[GraphEdge],
) -> Result<(), Box<dyn std::error::Error>> {
    let today = chrono::Utc::now().format("%Y-%m-%d").to_string();

    let mut lines = vec![
        format!("# detroit.primals.eco \u{2014} Complete Content Dump"),
        format!("# Generated: {today}"),
        format!("# Static site API: {BASE_URL}/api/site.json"),
        "# Epistemic grammar: record \u{2192} corroborated \u{2192} inference \u{2192} allegation \u{2192} filed \u{2192} adjudicated".to_string(),
        format!("# Network graph: /graph.json ({} nodes, {} edges)", nodes.len(), edges.len()),
        "# For the structured index, see llms.txt".to_string(),
        format!("# For the site, see {BASE_URL}"),
        String::new(),
    ];

    let md_files = frontmatter::collect_markdown_files(content_dir);

    for fpath in &md_files {
        let rel = fpath
            .strip_prefix(content_dir)
            .unwrap_or(fpath)
            .to_string_lossy()
            .to_string();
        let url = format!(
            "/{}",
            rel.replace("/_index.md", "/")
                .replace("_index.md", "/")
                .replace(".md", "/")
        );
        let file_rel = fpath
            .strip_prefix(root)
            .unwrap_or(fpath)
            .to_string_lossy()
            .to_string();

        let text = std::fs::read_to_string(fpath)?;
        let body = text
            .splitn(3, "+++")
            .nth(2)
            .unwrap_or(&text)
            .trim();

        lines.push("=".repeat(72));
        lines.push(format!("URL: {BASE_URL}{url}"));
        lines.push(format!("File: {file_rel}"));
        lines.push("=".repeat(72));
        lines.push(body.to_string());
        lines.push(String::new());
    }

    let output = lines.join("\n");
    std::fs::write(static_dir.join("llms-full.txt"), &output)?;
    println!("  \u{2705} {} pages, {} lines", md_files.len(), lines.len());
    Ok(())
}
