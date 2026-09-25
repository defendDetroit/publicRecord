#![forbid(unsafe_code)]
#![doc = "litho-core — shared substrate for sporePrint-family site builders."]
#![doc = ""]
#![doc = "Provides the common patterns shared by detroit-build, spore-validate,"]
#![doc = "and future primal sites: frontmatter parsing, BLAKE3 content manifests,"]
#![doc = "graph primitives, diagnostic reporting, typed registry parsing, and"]
#![doc = "Provenance Trio wire-format types."]

pub mod frontmatter;
pub mod graph;
pub mod manifest;
pub mod provenance;
pub mod registry;
pub mod report;
