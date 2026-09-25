//! BLAKE3 content manifest generation.
//!
//! Walk a content directory, hash every markdown file with BLAKE3,
//! produce a manifest with per-file hashes and a root hash.

use std::path::Path;

/// A single file entry in the manifest.
#[derive(Debug, Clone)]
pub struct ManifestEntry {
    pub rel_path: String,
    pub hash: String,
}

/// Complete content manifest.
#[derive(Debug, Clone)]
pub struct ContentManifest {
    pub root_hash: String,
    pub entries: Vec<ManifestEntry>,
}

/// Hash a single file with BLAKE3, returning the hex digest.
pub fn hash_file(path: &Path) -> Result<String, std::io::Error> {
    let data = std::fs::read(path)?;
    Ok(blake3::hash(&data).to_hex().to_string())
}

/// Build a content manifest from all markdown files in a directory.
///
/// `content_dir` — the directory to walk for `.md` files.
/// `strip_prefix` — prefix to remove from paths (e.g., repo root) for relative paths.
pub fn build(
    content_dir: &Path,
    strip_prefix: &Path,
) -> Result<ContentManifest, Box<dyn std::error::Error>> {
    let files = crate::frontmatter::collect_markdown_files(content_dir);
    let mut entries = Vec::with_capacity(files.len());
    let mut hashes = Vec::with_capacity(files.len());

    for path in &files {
        let data = std::fs::read(path)?;
        let hash = blake3::hash(&data).to_hex().to_string();
        let rel = path
            .strip_prefix(strip_prefix)
            .unwrap_or(path)
            .to_string_lossy()
            .to_string();
        entries.push(ManifestEntry {
            rel_path: rel,
            hash: hash.clone(),
        });
        hashes.push(hash);
    }

    let concat = hashes.join("\n") + "\n";
    let root_hash = blake3::hash(concat.as_bytes()).to_hex().to_string();

    Ok(ContentManifest {
        root_hash,
        entries,
    })
}

/// Serialize a manifest to TOML format.
pub fn to_toml(manifest: &ContentManifest, generated: &str) -> String {
    let mut lines = vec![
        "# BLAKE3 Content Manifest".to_string(),
        format!("# Generated: {generated}"),
        format!("# Pages: {}", manifest.entries.len()),
        format!("root_hash = \"{}\"", manifest.root_hash),
        String::new(),
        "[pages]".to_string(),
    ];
    for entry in &manifest.entries {
        lines.push(format!("\"{}\" = \"{}\"", entry.rel_path, entry.hash));
    }
    lines.join("\n") + "\n"
}
