//! Scan content/*.md, parse TOML frontmatter, extract taxonomies.
//!
//! Uses litho_core::frontmatter for the shared parsing substrate.

use litho_core::frontmatter;
use std::collections::BTreeMap;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct Section {
    pub url: String,
    pub title: String,
    pub description: String,
    pub file: String,
}

#[derive(Debug, Clone)]
pub struct Page {
    pub url: String,
    pub title: String,
    pub description: String,
    pub date: Option<String>,
    pub updated: Option<String>,
    pub weight: Option<i64>,
    pub file: String,
    pub taxonomies: BTreeMap<String, Vec<String>>,
    pub body: String,
    pub word_count: usize,
    pub section: String,
}

fn url_for_section(rel: &str) -> String {
    let url = format!("/{}", rel.replace("_index.md", ""));
    if url.ends_with('/') { url } else { format!("{url}/") }
}

fn url_for_page(rel: &str) -> String {
    format!("/{}/", rel.replace(".md", ""))
}

/// Scan content directory for all sections and pages.
pub fn scan_content(
    content_dir: &Path,
    root: &Path,
) -> Result<(BTreeMap<String, Section>, Vec<Page>), Box<dyn std::error::Error>> {
    let mut sections = BTreeMap::new();
    let mut pages = Vec::new();

    let md_files = frontmatter::collect_markdown_files(content_dir);

    for path in &md_files {
        let rel = path
            .strip_prefix(content_dir)
            .unwrap_or(path)
            .to_string_lossy()
            .to_string();
        let file_rel = path
            .strip_prefix(root)
            .unwrap_or(path)
            .to_string_lossy()
            .to_string();

        let text = std::fs::read_to_string(path)?;
        let Some(parsed) = frontmatter::parse(&text) else {
            continue;
        };

        if frontmatter::is_section(path) {
            let url = url_for_section(&rel);
            sections.insert(
                url.clone(),
                Section {
                    url,
                    title: frontmatter::get_str(&parsed.front, "title"),
                    description: frontmatter::get_str(&parsed.front, "description"),
                    file: file_rel,
                },
            );
        } else {
            let url = url_for_page(&rel);
            let taxonomies = frontmatter::extract_taxonomies(&parsed.front);

            let parts: Vec<&str> = url.trim_matches('/').split('/').collect();
            let section = if parts.len() > 1 {
                format!("/{}/", parts[..parts.len() - 1].join("/"))
            } else {
                "/".to_string()
            };

            pages.push(Page {
                url,
                title: frontmatter::get_str(&parsed.front, "title"),
                description: frontmatter::get_str(&parsed.front, "description"),
                date: frontmatter::get_opt_str(&parsed.front, "date"),
                updated: frontmatter::get_opt_str(&parsed.front, "updated"),
                weight: frontmatter::get_opt_int(&parsed.front, "weight"),
                file: file_rel,
                taxonomies,
                word_count: parsed.body.split_whitespace().count(),
                body: parsed.body,
                section,
            });
        }
    }

    Ok((sections, pages))
}
