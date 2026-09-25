//! Generic typed registry parsing from Zola `config.toml`.
//!
//! Both detroit and sporePrint keep typed entity registries in
//! `config.toml [extra.*]` tables. This module provides the common
//! pattern: parse an `[extra]` section, extract named registry tables,
//! and cross-reference entries against content pages.
//!
//! Detroit uses `[extra.actors]`, `[extra.entities]`, `[extra.sources]`.
//! sporePrint uses `[extra.entity_registry]`.
//! Any new primal site can define its own registries following the
//! same shape.

use std::collections::BTreeMap;

/// Parse the `[extra]` section from a Zola config.toml string.
///
/// Returns the raw TOML value for the `[extra]` table, which
/// consumers can then drill into for their specific registries.
pub fn parse_extra(config_text: &str) -> Option<toml::Value> {
    let parsed: toml::Value = toml::from_str(config_text).ok()?;
    parsed.get("extra").cloned()
}

/// Extract a named registry table from an `[extra]` TOML value.
///
/// For example, `extract_registry(extra, "actors")` returns the
/// `[extra.actors]` table as a `BTreeMap<String, toml::Value>`.
pub fn extract_registry(
    extra: &toml::Value,
    name: &str,
) -> BTreeMap<String, toml::Value> {
    extra
        .get(name)
        .and_then(|v| v.as_table())
        .map(|t| {
            t.iter()
                .map(|(k, v)| (k.clone(), v.clone()))
                .collect()
        })
        .unwrap_or_default()
}

/// Validate that every registry entry with a `page` field has a
/// corresponding content file.
///
/// Returns a list of `(key, page_path)` pairs that don't resolve.
pub fn validate_page_refs(
    registry: &BTreeMap<String, toml::Value>,
    content_pages: &[String],
) -> Vec<(String, String)> {
    let mut orphans = Vec::new();
    for (key, entry) in registry {
        if let Some(page) = entry.get("page").and_then(|v| v.as_str()) {
            if !page.is_empty() {
                let normalized = page.trim_matches('/');
                let found = content_pages.iter().any(|p| {
                    let p_norm = p.trim_matches('/');
                    p_norm == normalized || p_norm.ends_with(normalized)
                });
                if !found {
                    orphans.push((key.clone(), page.to_string()));
                }
            }
        }
    }
    orphans
}

/// Extract `display` names from a registry, keyed by registry key.
///
/// Useful for graph node labels: look up the human-readable name
/// for a registry key.
pub fn display_names(
    registry: &BTreeMap<String, toml::Value>,
) -> BTreeMap<String, String> {
    registry
        .iter()
        .filter_map(|(k, v)| {
            v.get("display")
                .and_then(|d| d.as_str())
                .map(|d| (k.clone(), d.to_string()))
        })
        .collect()
}
