//! Provenance Trio wire-format types — shared vocabulary for any
//! sporePrint-family site that speaks the Provenance Trio protocol.
//!
//! These types mirror the JSON-RPC IPC formats of:
//!   sweetGrass  — PROV-O braids with Witness attestation
//!   nestGate    — content-addressed storage (BLAKE3)
//!   loamSpine   — permanent hash-chain spine
//!   bearDog     — Ed25519 signatures
//!
//! No primal source code is imported. Sites use these types to
//! generate JSON-RPC request bodies that local primal sockets accept.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ── Epistemic grammar ───────────────────────────────────────────────────
//
// Seven levels of claim confidence, mapping to sweetGrass Witness
// attestation tiers. Any primal site with typed edges can use this
// grammar to express how verified a claim is.
//
// | status       | witness_kind | witness_tier | Meaning                      |
// |--------------|-------------|--------------|------------------------------|
// | record       | "hash"      | "anchor"     | Source doc BLAKE3 in CAS     |
// | corroborated | "hash"      | "gateway"    | Multiple source hashes       |
// | inference    | "marker"    | "open"       | Analytical conclusion        |
// | allegation   | "marker"    | "local"      | Filed complaint, CAS-anchored|
// | filed        | "hash"      | "anchor"     | Filing receipt in CAS        |
// | adjudicated  | "signature" | "external"   | Court/authority determination |
// | corrected    | "marker"    | "open"       | alternateOf → corrected braid|

/// Epistemic status levels for typed graph edges.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EpistemicStatus {
    Record,
    Corroborated,
    Inference,
    Allegation,
    Filed,
    Adjudicated,
    Corrected,
}

impl EpistemicStatus {
    /// Map to sweetGrass Witness (kind, tier) pair.
    #[must_use]
    pub const fn to_witness(self) -> (&'static str, &'static str) {
        match self {
            Self::Record => ("hash", "anchor"),
            Self::Corroborated => ("hash", "gateway"),
            Self::Inference => ("marker", "open"),
            Self::Allegation => ("marker", "local"),
            Self::Filed => ("hash", "anchor"),
            Self::Adjudicated => ("signature", "external"),
            Self::Corrected => ("marker", "open"),
        }
    }
}

impl std::fmt::Display for EpistemicStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            Self::Record => "record",
            Self::Corroborated => "corroborated",
            Self::Inference => "inference",
            Self::Allegation => "allegation",
            Self::Filed => "filed",
            Self::Adjudicated => "adjudicated",
            Self::Corrected => "corrected",
        })
    }
}

/// Map a string epistemic status to sweetGrass Witness (kind, tier).
///
/// Accepts the lowercase string form. Unknown statuses default to
/// `("marker", "open")`.
#[must_use]
pub fn epistemic_to_witness(status: &str) -> (&'static str, &'static str) {
    match status {
        "record" => ("hash", "anchor"),
        "corroborated" => ("hash", "gateway"),
        "inference" => ("marker", "open"),
        "allegation" => ("marker", "local"),
        "filed" => ("hash", "anchor"),
        "adjudicated" => ("signature", "external"),
        "corrected" => ("marker", "open"),
        _ => ("marker", "open"),
    }
}

// ── Convergence depth ───────────────────────────────────────────────────
//
// 5-stage meter for "how deep into the provenance stack is this claim?"
// Any primal site can use this to express verification depth.

/// How deep into the Provenance Trio stack a claim has been verified.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum ConvergenceDepth {
    /// BLAKE3 hash exists in nestGate CAS
    Cas = 1,
    /// Recorded in rhizoCrypt DAG session
    Dag = 2,
    /// Committed to loamSpine permanent ledger
    Spine = 3,
    /// sweetGrass PROV-O braid created
    Braid = 4,
    /// bearDog Ed25519 signature witness
    Signed = 5,
}

impl std::fmt::Display for ConvergenceDepth {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Cas => write!(f, "CAS (BLAKE3 hash present)"),
            Self::Dag => write!(f, "DAG (session recorded)"),
            Self::Spine => write!(f, "Spine (permanently anchored)"),
            Self::Braid => write!(f, "Braid (PROV-O attributed)"),
            Self::Signed => write!(f, "Signed (Ed25519 witness)"),
        }
    }
}

// ── sweetGrass wire types ───────────────────────────────────────────────

/// Witness attestation (sweetGrass wire format).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Witness {
    pub agent: String,
    pub kind: String,
    pub evidence: String,
    pub witnessed_at: u64,
    pub encoding: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<String>,
}

/// PROV-O activity (who did what, with what tool).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Activity {
    pub agent: String,
    pub plan: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub software: Option<String>,
}

/// PROV-O entity reference (for derivation chains).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityRef {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hash: Option<String>,
}

/// Braid metadata sidecar.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BraidMetadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub tags: Vec<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub custom: HashMap<String, serde_json::Value>,
}

/// Braid creation request (sweetGrass `braid.create` JSON-RPC params).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BraidCreateParams {
    pub data_hash: String,
    pub mime_type: String,
    pub size: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub was_generated_by: Option<Activity>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub was_derived_from: Vec<EntityRef>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub was_attributed_to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<BraidMetadata>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub witness: Option<Witness>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub alternate_of: Vec<EntityRef>,
}

// ── nestGate CAS wire types ─────────────────────────────────────────────

/// CAS put request (nestGate `content.put` JSON-RPC params).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CasPutParams {
    pub hash: String,
    pub data: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub meta: Option<CasMeta>,
}

/// Metadata sidecar for CAS objects.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CasMeta {
    pub source: String,
    pub pipeline: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub derived_from: Option<Vec<String>>,
}
