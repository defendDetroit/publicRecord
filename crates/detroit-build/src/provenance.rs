//! Provenance Trio integration — type mappings and IPC wire formats.
//!
//! Maps detroit's evidence model to the Provenance Trio:
//!   nestGate CAS  — content-addressed storage (BLAKE3)
//!   rhizoCrypt    — ephemeral DAG + Merkle sessions
//!   loamSpine     — permanent hash-chain spine
//!   bearDog       — Ed25519 signatures
//!   sweetGrass    — PROV-O braids with Witness attestation
//!
//! This module defines the wire-format JSON types for JSON-RPC IPC
//! to local primal sockets. No primal source code is imported.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ── Epistemic status to Witness mapping ─────────────────────────────────
//
// detroit `epistemic_status` → sweetGrass `Witness { kind, tier }`
//
// | epistemic_status | kind        | tier       | Meaning                        |
// |------------------|-------------|------------|--------------------------------|
// | record           | "hash"      | "anchor"   | Source doc BLAKE3 in CAS       |
// | corroborated     | "hash"      | "gateway"  | Multiple source hashes         |
// | inference        | "marker"    | "open"     | Analytical conclusion          |
// | allegation       | "marker"    | "local"    | Filed complaint, CAS-anchored  |
// | filed            | "hash"      | "anchor"   | Filing receipt in CAS          |
// | adjudicated      | "signature" | "external" | Court determination            |
// | corrected        | "marker"    | "open"     | alternateOf → corrected braid  |

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

/// Map detroit's epistemic_status to sweetGrass Witness kind + tier.
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

// ── Braid wire format (sweetGrass JSON-RPC) ─────────────────────────────

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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Activity {
    pub agent: String,
    pub plan: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub software: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityRef {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hash: Option<String>,
}

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

// ── nestGate CAS wire format ────────────────────────────────────────────

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

// ── convergence.check ───────────────────────────────────────────────────
//
// 5-stage depth meter for "how verified is this claim?"
//
// | Stage | Depth | Meaning for detroit                         |
// |-------|-------|---------------------------------------------|
// | CAS   | 1     | Evidence page exists with BLAKE3 hash       |
// | DAG   | 2     | Claim was part of a build session            |
// | Spine | 3     | Build wave is permanently anchored           |
// | Braid | 4     | Relationship has PROV-O attribution          |
// | Sign  | 5     | bearDog Ed25519 witness on the specific claim|

/// Convergence depth — how deep into the provenance stack a claim has been verified.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum ConvergenceDepth {
    /// BLAKE3 hash exists in CAS
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

// ── Build braids from detroit graph edges ────────────────────────────────

use crate::graph::GraphEdge;

const DETROIT_DID: &str = "did:web:detroit.primals.eco";
const PIPELINE: &str = "detroit-build/0.1.0";

/// Convert a detroit graph edge into a sweetGrass braid creation request.
pub fn edge_to_braid(
    edge: &GraphEdge,
    source_hash: Option<&str>,
    target_hash: Option<&str>,
) -> BraidCreateParams {
    let (witness_kind, witness_tier) = epistemic_to_witness(&edge.epistemic_status);

    let data_hash = format!(
        "blake3:edge:{}->{}:{}",
        edge.source, edge.target, edge.edge_type
    );
    let edge_desc = format!(
        "{} → {} ({})",
        edge.source, edge.target, edge.edge_type
    );

    let mut custom = HashMap::new();
    custom.insert(
        "edge_type".into(),
        serde_json::Value::String(edge.edge_type.clone()),
    );
    custom.insert(
        "epistemic_status".into(),
        serde_json::Value::String(edge.epistemic_status.clone()),
    );
    if let Some(role) = &edge.role {
        custom.insert("role".into(), serde_json::Value::String(role.clone()));
    }
    if let Some(amount) = &edge.amount {
        custom.insert("amount_usd".into(), serde_json::Value::String(amount.clone()));
    }
    if let Some(doc) = &edge.source_doc {
        custom.insert("source_doc".into(), serde_json::Value::String(doc.clone()));
    }

    let mut was_derived_from = Vec::new();
    if let Some(hash) = source_hash {
        was_derived_from.push(EntityRef {
            id: format!("urn:content:detroit:{}", edge.source),
            hash: Some(hash.to_string()),
        });
    }
    if let Some(hash) = target_hash {
        was_derived_from.push(EntityRef {
            id: format!("urn:content:detroit:{}", edge.target),
            hash: Some(hash.to_string()),
        });
    }

    let now_nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos() as u64;

    BraidCreateParams {
        data_hash,
        mime_type: "application/json".into(),
        size: 0,
        was_generated_by: Some(Activity {
            agent: DETROIT_DID.into(),
            plan: "detroit-build graph edge to PROV-O braid".into(),
            software: Some(PIPELINE.into()),
        }),
        was_derived_from,
        was_attributed_to: Some(DETROIT_DID.into()),
        metadata: Some(BraidMetadata {
            title: Some(edge_desc),
            description: edge.note.clone(),
            tags: vec![
                edge.edge_type.clone(),
                edge.epistemic_status.clone(),
                "detroit".into(),
            ],
            custom,
        }),
        witness: Some(Witness {
            agent: DETROIT_DID.into(),
            kind: witness_kind.into(),
            evidence: String::new(),
            witnessed_at: now_nanos,
            encoding: "none".into(),
            algorithm: None,
            tier: Some(witness_tier.into()),
            context: Some(format!("detroit-build edge: {} -> {}", edge.source, edge.target)),
        }),
        alternate_of: Vec::new(),
    }
}

/// Convert a content page into a nestGate CAS put request.
pub fn page_to_cas_put(
    content_hash: &str,
    data: &[u8],
    mime_type: &str,
) -> CasPutParams {
    CasPutParams {
        hash: content_hash.to_string(),
        data: base64_encode(data),
        mime_type: Some(mime_type.into()),
        meta: Some(CasMeta {
            source: "git:publicRecord/detroit".into(),
            pipeline: PIPELINE.into(),
            derived_from: None,
        }),
    }
}

fn base64_encode(data: &[u8]) -> String {
    const ALPHABET: &[u8; 64] =
        b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity((data.len() + 2) / 3 * 4);
    for chunk in data.chunks(3) {
        let b = match chunk.len() {
            3 => ((chunk[0] as u32) << 16) | ((chunk[1] as u32) << 8) | (chunk[2] as u32),
            2 => ((chunk[0] as u32) << 16) | ((chunk[1] as u32) << 8),
            1 => (chunk[0] as u32) << 16,
            _ => unreachable!(),
        };
        out.push(ALPHABET[((b >> 18) & 0x3F) as usize] as char);
        out.push(ALPHABET[((b >> 12) & 0x3F) as usize] as char);
        if chunk.len() > 1 {
            out.push(ALPHABET[((b >> 6) & 0x3F) as usize] as char);
        } else {
            out.push('=');
        }
        if chunk.len() > 2 {
            out.push(ALPHABET[(b & 0x3F) as usize] as char);
        } else {
            out.push('=');
        }
    }
    out
}
