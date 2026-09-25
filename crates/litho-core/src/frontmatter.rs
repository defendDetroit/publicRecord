//! Parse `+++ TOML +++` frontmatter from Zola markdown files.
//!
//! Both detroit-build and spore-validate share this pattern:
//! split on `+++`, parse the middle as TOML, return the body.

use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

/// Parsed frontmatter + body from a markdown file.
#[derive(Debug, Clone)]
pub struct Parsed {
    pub front: toml::Value,
    pub body: String,
}

/// Parse `+++ TOML +++` delimited frontmatter.
///
/// Returns `None` if the file does not contain the expected delimiters.
pub fn parse(text: &str) -> Option<Parsed> {
    let parts: Vec<&str> = text.splitn(3, "+++").collect();
    if parts.len() < 3 {
        return None;
    }
    let front: toml::Value = toml::from_str(parts[1]).ok()?;
    let body = parts[2].trim().to_string();
    Some(Parsed { front, body })
}

/// Extract a string field from a TOML value.
pub fn get_str(val: &toml::Value, key: &str) -> String {
    val.get(key)
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string()
}

/// Extract an optional string field.
pub fn get_opt_str(val: &toml::Value, key: &str) -> Option<String> {
    val.get(key).and_then(|v| v.as_str()).map(String::from)
}

/// Extract an optional integer field.
pub fn get_opt_int(val: &toml::Value, key: &str) -> Option<i64> {
    val.get(key).and_then(|v| v.as_integer())
}

/// Extract taxonomies from the `[taxonomies]` table in frontmatter.
pub fn extract_taxonomies(front: &toml::Value) -> BTreeMap<String, Vec<String>> {
    let mut taxonomies = BTreeMap::new();
    if let Some(tax_table) = front.get("taxonomies") {
        if let Some(table) = tax_table.as_table() {
            for (name, val) in table {
                let terms: Vec<String> = match val {
                    toml::Value::Array(arr) => arr
                        .iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect(),
                    toml::Value::String(s) => vec![s.clone()],
                    _ => vec![],
                };
                if !terms.is_empty() {
                    taxonomies.insert(name.clone(), terms);
                }
            }
        }
    }
    taxonomies
}

/// Collect all `.md` files under a directory, sorted by path.
pub fn collect_markdown_files(dir: &Path) -> Vec<PathBuf> {
    let mut files: Vec<PathBuf> = WalkDir::new(dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
        .filter(|e| e.path().extension().is_some_and(|ext| ext == "md"))
        .map(|e| e.into_path())
        .collect();
    files.sort();
    files
}

/// Check if a file is a Zola section (`_index.md`) vs a page.
pub fn is_section(path: &Path) -> bool {
    path.file_name().is_some_and(|n| n == "_index.md")
}
