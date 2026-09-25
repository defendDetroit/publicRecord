//! Shell out to `zola build` and parse output.

use std::path::Path;
use std::process::Command;

pub fn build_zola(site_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n[1/7] Zola build \u{2192} HTML, sitemap, atom, search");

    let output = Command::new("zola")
        .arg("build")
        .current_dir(site_dir)
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("zola build failed:\n{stderr}").into());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    if let Some(line) = stdout.lines().find(|l| l.contains("Creating")) {
        println!("  \u{2705} {}", line.trim().trim_start_matches("-> "));
    }

    Ok(())
}
