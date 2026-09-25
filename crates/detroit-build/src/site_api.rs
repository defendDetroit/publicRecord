//! Generate /api/site.json — site structure API for bots and agents.

use crate::content::{Page, Section};
use serde::Serialize;
use std::collections::BTreeMap;
use std::path::Path;

const BASE_URL: &str = "https://detroit.primals.eco";

#[derive(Serialize)]
struct SiteApiJson {
    _comment: String,
    meta: Meta,
    endpoints: Endpoints,
    epistemic_grammar: EpistemicGrammarDoc,
    sections: BTreeMap<String, SectionOut>,
    pages: Vec<PageOut>,
    taxonomies: BTreeMap<String, BTreeMap<String, TaxTerm>>,
}

#[derive(Serialize)]
struct Meta {
    generator: String,
    generated: String,
    base_url: String,
    title: String,
    total_sections: usize,
    total_pages: usize,
    total_words: usize,
    total_taxonomy_terms: usize,
}

#[derive(Serialize)]
struct Endpoints {
    human: BTreeMap<String, String>,
    machine: BTreeMap<String, String>,
}

#[derive(Serialize)]
struct EpistemicGrammarDoc {
    claim_levels: BTreeMap<String, String>,
    principle: String,
}

#[derive(Serialize)]
struct SectionOut {
    path: String,
    url: String,
    title: String,
    description: String,
    pages: Vec<String>,
    subsections: Vec<String>,
}

#[derive(Serialize)]
struct PageOut {
    path: String,
    url: String,
    title: String,
    description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    updated: Option<String>,
    word_count: usize,
    section: String,
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    taxonomies: BTreeMap<String, Vec<String>>,
}

#[derive(Serialize)]
struct TaxTerm {
    pages: Vec<String>,
    count: usize,
}

pub fn build_site_api(
    sections: &BTreeMap<String, Section>,
    pages: &[Page],
    static_dir: &Path,
) -> Result<usize, Box<dyn std::error::Error>> {
    let now = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();

    // Build section output with page lists and subsection links
    let mut section_out: BTreeMap<String, SectionOut> = BTreeMap::new();
    for (path, sec) in sections {
        section_out.insert(
            path.clone(),
            SectionOut {
                path: path.clone(),
                url: format!("{BASE_URL}{path}"),
                title: sec.title.clone(),
                description: sec.description.clone(),
                pages: Vec::new(),
                subsections: Vec::new(),
            },
        );
    }

    // Link pages to sections
    for p in pages {
        if let Some(sec) = section_out.get_mut(&p.section) {
            sec.pages.push(p.url.clone());
        }
    }

    // Link subsections
    let paths: Vec<String> = section_out.keys().cloned().collect();
    for path in &paths {
        if path == "/" {
            continue;
        }
        let parts: Vec<&str> = path.trim_matches('/').split('/').collect();
        let parent = if parts.len() > 1 {
            format!("/{}/", parts[..parts.len() - 1].join("/"))
        } else {
            "/".to_string()
        };
        if section_out.contains_key(&parent) {
            let child = path.clone();
            if let Some(p) = section_out.get_mut(&parent) {
                p.subsections.push(child);
            }
        }
    }

    // Build page output
    let page_out: Vec<PageOut> = pages
        .iter()
        .map(|p| PageOut {
            path: p.url.clone(),
            url: format!("{BASE_URL}{}", p.url),
            title: p.title.clone(),
            description: p.description.clone(),
            date: p.date.clone(),
            updated: p.updated.clone(),
            word_count: p.word_count,
            section: p.section.clone(),
            taxonomies: p.taxonomies.clone(),
        })
        .collect();

    // Build taxonomy index
    let mut tax_index: BTreeMap<String, BTreeMap<String, Vec<String>>> = BTreeMap::new();
    for p in pages {
        for (tax, terms) in &p.taxonomies {
            for term in terms {
                tax_index
                    .entry(tax.clone())
                    .or_default()
                    .entry(term.clone())
                    .or_default()
                    .push(p.url.clone());
            }
        }
    }
    let taxonomies: BTreeMap<String, BTreeMap<String, TaxTerm>> = tax_index
        .into_iter()
        .map(|(name, terms)| {
            let term_map = terms
                .into_iter()
                .map(|(term, pages)| {
                    let count = pages.len();
                    (term, TaxTerm { pages, count })
                })
                .collect();
            (name, term_map)
        })
        .collect();

    let total_tax_terms: usize = taxonomies.values().map(|t| t.len()).sum();
    let total_words: usize = pages.iter().map(|p| p.word_count).sum::<usize>()
        + sections.values().map(|_| 0usize).sum::<usize>();

    let mut human_endpoints = BTreeMap::new();
    human_endpoints.insert("homepage".into(), format!("{BASE_URL}/"));
    human_endpoints.insert("search".into(), "Built-in elasticlunr full-text search in nav bar".into());
    human_endpoints.insert("atom_feed".into(), format!("{BASE_URL}/atom.xml"));

    let mut machine_endpoints = BTreeMap::new();
    for (k, v) in [
        ("site_api", "/api/site.json"),
        ("network_graph_json", "/graph.json"),
        ("network_graph_csv", "/graph.csv"),
        ("sitemap_xml", "/sitemap.xml"),
        ("llms_index", "/llms.txt"),
        ("llms_full_content", "/llms-full.txt"),
        ("content_manifest", "/content-manifest.toml"),
        ("robots_txt", "/robots.txt"),
    ] {
        machine_endpoints.insert(k.into(), format!("{BASE_URL}{v}"));
    }

    let mut claim_levels = BTreeMap::new();
    for (k, v) in [
        ("record", "Verifiable public fact from a government database or official document."),
        ("corroborated", "Independently confirmed by 2+ sources."),
        ("inference", "Analytical conclusion drawn from records. Not adjudicated."),
        ("allegation", "Formally alleged in complaint. Awaiting determination."),
        ("filed", "Submitted to agency or court. Pending."),
        ("adjudicated", "Determined by court or agency."),
        ("corrected", "Previously published claim corrected."),
    ] {
        claim_levels.insert(k.into(), v.into());
    }

    let api = SiteApiJson {
        _comment: "Static site API for bots and agents. Auto-generated — do not edit.".into(),
        meta: Meta {
            generator: "detroit-build/0.1.0".into(),
            generated: now,
            base_url: BASE_URL.into(),
            title: "Cash for Kids 2: A Public Record".into(),
            total_sections: sections.len(),
            total_pages: pages.len(),
            total_words,
            total_taxonomy_terms: total_tax_terms,
        },
        endpoints: Endpoints {
            human: human_endpoints,
            machine: machine_endpoints,
        },
        epistemic_grammar: EpistemicGrammarDoc {
            claim_levels,
            principle: "Record \u{2192} Corroborated \u{2192} Inference \u{2192} Allegation \u{2192} Filed \u{2192} Adjudicated".into(),
        },
        sections: section_out,
        pages: page_out,
        taxonomies,
    };

    let json = serde_json::to_string_pretty(&api)?;
    std::fs::create_dir_all(static_dir.join("api"))?;
    std::fs::write(static_dir.join("api/site.json"), &json)?;
    Ok(json.len())
}
