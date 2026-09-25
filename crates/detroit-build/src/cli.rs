use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(
    name = "detroit-build",
    about = "Unified build for detroit.primals.eco — all layers from the same source of truth",
    version
)]
pub struct Cli {
    /// Path to detroit repo root (contains site/, data/)
    #[arg(short, long, default_value = ".", global = true)]
    pub root: PathBuf,

    /// Verify consistency only — do not write any files
    #[arg(long, global = true)]
    pub check: bool,

    #[command(subcommand)]
    pub command: Option<Command>,
}

#[derive(Subcommand)]
pub enum Command {
    /// Build graph.json + graph.csv from registries + edges.toml
    Graph,
    /// Generate BLAKE3 content manifest
    Manifest,
    /// Generate api/site.json
    SiteApi,
    /// Generate llms.txt + llms-full.txt
    Llms,
    /// Cross-check all layers for consistency
    Verify,
    /// Emit braid JSON for all graph edges (sweetGrass PROV-O format)
    Braids,
    /// Emit CAS manifest in nestGate content.put format
    CasManifest,
}
