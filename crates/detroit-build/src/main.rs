#![forbid(unsafe_code)]
#![doc = "detroit-build — unified build tool for detroit.primals.eco"]

use clap::Parser;
use std::process::ExitCode;

mod cli;
mod content;
mod graph;
mod llms;
mod manifest;
mod provenance;
mod registry;
mod site_api;
mod verify;
mod zola;

use cli::{Cli, Command};

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("  \u{274c} {e}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    let root = cli.root.canonicalize().unwrap_or_else(|_| cli.root.clone());

    let site = root.join("site");
    let config_path = site.join("config.toml");
    let content_dir = site.join("content");
    let static_dir = site.join("static");
    let data_dir = root.join("data");

    // Single subcommand dispatch
    if let Some(cmd) = &cli.command {
        let config_text = std::fs::read_to_string(&config_path)?;
        let reg = registry::parse_config(&config_text)?;
        let edges = graph::parse_edges(&data_dir.join("edges.toml"))?;
        let (sections, pages) = content::scan_content(&content_dir, &root)?;

        match cmd {
            Command::Graph => {
                let (nodes, valid_edges) = graph::build_nodes(&reg, &edges);
                if !cli.check {
                    graph::write_graph(&static_dir, &nodes, &valid_edges)?;
                }
            }
            Command::Manifest => {
                if !cli.check {
                    manifest::build_manifest(&content_dir, &root, &static_dir)?;
                }
            }
            Command::SiteApi => {
                if !cli.check {
                    site_api::build_site_api(&sections, &pages, &static_dir)?;
                }
            }
            Command::Llms => {
                let (nodes, valid_edges) = graph::build_nodes(&reg, &edges);
                if !cli.check {
                    llms::build_llms_txt(
                        &reg, &sections, &pages, &nodes, &valid_edges,
                        &data_dir, &static_dir,
                    )?;
                    llms::build_llms_full(&content_dir, &root, &static_dir, &nodes, &valid_edges)?;
                }
            }
            Command::Verify => {
                let (nodes, valid_edges) = graph::build_nodes(&reg, &edges);
                let report = verify::verify_all(&reg, &sections, &pages, &nodes, &valid_edges);
                report.print();
                if report.has_errors() {
                    return Err("Consistency check failed".into());
                }
            }
            Command::Braids => {
                let (_nodes, valid_edges) = graph::build_nodes(&reg, &edges);
                let content_manifest = litho_core::manifest::build(&content_dir, &root)?;
                // Map: page URL → BLAKE3 hash
                let url_hash: std::collections::BTreeMap<String, String> = pages
                    .iter()
                    .filter_map(|p| {
                        let file = &p.file;
                        content_manifest.entries.iter()
                            .find(|e| e.rel_path == *file)
                            .map(|e| (p.url.clone(), e.hash.clone()))
                    })
                    .collect();
                // Map: actor/entity key → page URL
                let mut key_page: std::collections::BTreeMap<String, String> = std::collections::BTreeMap::new();
                for (k, a) in &reg.actors {
                    if !a.page.is_empty() {
                        key_page.insert(k.clone(), a.page.clone());
                    }
                }
                for (k, e) in &reg.entities {
                    if !e.page.is_empty() {
                        key_page.insert(k.clone(), e.page.clone());
                    }
                }
                let braids: Vec<provenance::BraidCreateParams> = valid_edges
                    .iter()
                    .map(|e| {
                        let src_hash = key_page.get(&e.source)
                            .and_then(|url| url_hash.get(url))
                            .map(String::as_str);
                        let tgt_hash = key_page.get(&e.target)
                            .and_then(|url| url_hash.get(url))
                            .map(String::as_str);
                        provenance::edge_to_braid(e, src_hash, tgt_hash)
                    })
                    .collect();
                if !cli.check {
                    let json = serde_json::to_string_pretty(&braids)?;
                    let out = static_dir.join("braids.json");
                    std::fs::write(&out, &json)?;
                    println!("  \u{2705} {} braids \u{2192} braids.json ({} bytes)", braids.len(), json.len());
                } else {
                    println!("  \u{2705} {} braids (check mode, not written)", braids.len());
                }
            }
            Command::CasManifest => {
                let content_manifest = litho_core::manifest::build(&content_dir, &root)?;
                let files = litho_core::frontmatter::collect_markdown_files(&content_dir);
                let cas_entries: Vec<provenance::CasPutParams> = files
                    .iter()
                    .filter_map(|path| {
                        let data = std::fs::read(path).ok()?;
                        let hash = content_manifest.entries.iter()
                            .find(|e| path.ends_with(&e.rel_path))
                            .map(|e| e.hash.as_str())?;
                        Some(provenance::page_to_cas_put(hash, &data, "text/markdown"))
                    })
                    .collect();
                if !cli.check {
                    let json = serde_json::to_string_pretty(&cas_entries)?;
                    let out = static_dir.join("cas-manifest.json");
                    std::fs::write(&out, &json)?;
                    println!("  \u{2705} {} CAS entries \u{2192} cas-manifest.json ({} bytes)", cas_entries.len(), json.len());
                } else {
                    println!("  \u{2705} {} CAS entries (check mode, not written)", cas_entries.len());
                }
            }
        }
        return Ok(());
    }

    // Full build (default — all 7 steps)
    println!("{}", "=".repeat(60));
    println!("detroit.primals.eco — unified build (Rust)");
    println!("{}", "=".repeat(60));

    if cli.check {
        println!("MODE: consistency check only (no files written)");
    }

    // [0/7] Parse sources of truth
    println!("\n[0/7] Parsing sources of truth");
    let config_text = std::fs::read_to_string(&config_path)?;
    let reg = registry::parse_config(&config_text)?;
    let edges = graph::parse_edges(&data_dir.join("edges.toml"))?;
    let (sections, pages) = content::scan_content(&content_dir, &root)?;
    println!(
        "  \u{2705} config.toml: {} actors, {} entities, {} sources",
        reg.actors.len(), reg.entities.len(), reg.sources.len()
    );
    println!("  \u{2705} edges.toml: {} edges", edges.len());
    println!(
        "  \u{2705} content/: {} sections, {} pages",
        sections.len(), pages.len()
    );

    // [1/7] Zola build
    if !cli.check {
        zola::build_zola(&site)?;
    }

    // [2/7] Graph
    println!("\n[2/7] Graph \u{2192} graph.json + graph.csv");
    let (nodes, valid_edges) = graph::build_nodes(&reg, &edges);
    if !cli.check {
        graph::write_graph(&static_dir, &nodes, &valid_edges)?;
    }
    println!(
        "  \u{2705} {} nodes, {} edges \u{2192} graph.json + graph.csv",
        nodes.len(), valid_edges.len()
    );

    // [3/7] Site API
    println!("\n[3/7] Site API \u{2192} api/site.json");
    if !cli.check {
        let api_size = site_api::build_site_api(&sections, &pages, &static_dir)?;
        println!("  \u{2705} api/site.json ({api_size} bytes)");
    }

    // [4/7] llms.txt
    println!("\n[4/7] llms.txt \u{2192} agent index");
    if !cli.check {
        llms::build_llms_txt(
            &reg, &sections, &pages, &nodes, &valid_edges,
            &data_dir, &static_dir,
        )?;
    }

    // [5/7] llms-full.txt
    println!("\n[5/7] llms-full.txt \u{2192} complete content dump");
    if !cli.check {
        llms::build_llms_full(&content_dir, &root, &static_dir, &nodes, &valid_edges)?;
    }

    // [6/7] Content manifest
    println!("\n[6/7] content-manifest.toml \u{2192} BLAKE3 hashes");
    if !cli.check {
        manifest::build_manifest(&content_dir, &root, &static_dir)?;
    }

    // [7/7] Verify
    println!("\n[7/7] Consistency verification");
    let report = verify::verify_all(&reg, &sections, &pages, &nodes, &valid_edges);
    report.print();

    // Summary
    println!("\n{}", "=".repeat(60));
    if report.has_errors() {
        println!(
            "\u{1f6d1} {} errors, {} warnings",
            report.error_count(), report.warning_count()
        );
        return Err("Build failed with errors".into());
    } else if report.warning_count() > 0 {
        println!(
            "\u{26a0}\u{fe0f}  0 errors, {} warnings",
            report.warning_count()
        );
    } else {
        println!("\u{2705} All layers consistent. Zero errors, zero warnings.");
    }

    if !cli.check {
        println!("\nDerived files:");
        for f in &[
            "site/static/graph.json",
            "site/static/graph.csv",
            "site/static/api/site.json",
            "site/static/llms.txt",
            "site/static/llms-full.txt",
            "content-manifest.toml",
            "site/static/content-manifest.toml",
        ] {
            let path = root.join(f);
            if path.exists() {
                let size = path.metadata().map(|m| m.len()).unwrap_or(0);
                println!("  {f} ({size} bytes)");
            }
        }
    }

    Ok(())
}
