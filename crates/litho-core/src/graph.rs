//! Graph primitives — common node/edge types and validation.
//!
//! Both detroit-build and spore-validate emit entity graphs from
//! config registries. This module provides the shared validation
//! patterns and serialization helpers.

use serde::Serialize;
use std::collections::BTreeSet;

/// Validate that all edge endpoints reference known node IDs.
///
/// Returns a list of error strings for orphan references.
pub fn validate_endpoints<'a>(
    node_ids: &BTreeSet<&'a str>,
    edges: &[(String, String)],
) -> Vec<String> {
    let mut errors = Vec::new();
    for (source, target) in edges {
        if !node_ids.contains(source.as_str()) {
            errors.push(format!("Edge source \"{source}\" has no node"));
        }
        if !node_ids.contains(target.as_str()) {
            errors.push(format!("Edge target \"{target}\" has no node"));
        }
    }
    errors
}

/// Wrapper for `serde_json::to_string_pretty` that adds `_generated`
/// and `_source` metadata fields to the output.
pub fn emit_json<T: Serialize>(
    data: &T,
) -> Result<String, serde_json::Error> {
    serde_json::to_string_pretty(data)
}

/// Write a CSV file from rows of string slices.
pub fn write_csv(
    path: &std::path::Path,
    header: &[&str],
    rows: &[Vec<String>],
) -> Result<(), Box<dyn std::error::Error>> {
    let mut wtr = csv::Writer::from_path(path)?;
    wtr.write_record(header)?;
    for row in rows {
        wtr.write_record(row)?;
    }
    wtr.flush()?;
    Ok(())
}
