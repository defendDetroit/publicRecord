//! BLAKE3 content manifest — delegates to litho_core::manifest.

use std::path::Path;

/// Build content-manifest.toml with BLAKE3 hashes for every content page.
pub fn build_manifest(
    content_dir: &Path,
    root: &Path,
    static_dir: &Path,
) -> Result<(), Box<dyn std::error::Error>> {
    let manifest = litho_core::manifest::build(content_dir, root)?;
    let now = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();
    let toml_str = litho_core::manifest::to_toml(&manifest, &now);

    std::fs::write(root.join("content-manifest.toml"), &toml_str)?;
    std::fs::write(static_dir.join("content-manifest.toml"), &toml_str)?;

    println!(
        "  \u{2705} {} files, root_hash={}...",
        manifest.entries.len(),
        &manifest.root_hash[..16]
    );

    Ok(())
}
