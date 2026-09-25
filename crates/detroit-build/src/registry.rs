//! Parse config.toml actor/entity/source registries into typed structs.

use serde::Deserialize;
use std::collections::BTreeMap;

/// Top-level config.toml `[extra]` section.
#[derive(Debug, Default, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub actors: BTreeMap<String, Actor>,
    #[serde(default)]
    pub entities: BTreeMap<String, Entity>,
    #[serde(default)]
    pub sources: BTreeMap<String, Source>,
    #[serde(default)]
    pub bmf: Option<BmfConnection>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Actor {
    pub display: String,
    #[serde(default)]
    pub short: String,
    #[serde(default)]
    pub role: String,
    #[serde(default)]
    pub tier: u8,
    #[serde(default)]
    pub page: String,
    #[serde(default)]
    pub convictions: Option<String>,
    #[serde(default)]
    pub conviction_count: Option<u32>,
    #[serde(default)]
    pub sid: Option<String>,
    #[serde(default)]
    pub address: Option<String>,
    #[serde(default)]
    pub credential_claim: Option<String>,
    #[serde(default)]
    pub credential_status: Option<String>,
    #[serde(default)]
    pub connection: Option<String>,
    #[serde(default)]
    pub court: Option<String>,
    #[serde(default)]
    pub election: Option<String>,
    #[serde(default)]
    pub criminal_record: Option<String>,
    #[serde(default)]
    pub mdoc: Option<String>,
    #[serde(default)]
    pub discharge: Option<String>,
    #[serde(default)]
    pub birth_name: Option<String>,
    #[serde(default)]
    pub bar_number: Option<String>,
    #[serde(default)]
    pub firm: Option<String>,
    #[serde(default)]
    pub current_role: Option<String>,
    #[serde(default)]
    pub former_role: Option<String>,
    #[serde(default)]
    pub office: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Entity {
    pub display: String,
    #[serde(default)]
    pub short: Option<String>,
    #[serde(default)]
    pub lara_id: Option<String>,
    #[serde(default)]
    pub ein: Option<String>,
    #[serde(rename = "type", default)]
    pub entity_type: String,
    #[serde(default)]
    pub page: String,
    #[serde(default)]
    pub connection: Option<String>,
    #[serde(default)]
    pub authorizer: Option<String>,
    #[serde(default)]
    pub revenue: Option<String>,
    #[serde(default)]
    pub extraction_pct: Option<String>,
    #[serde(default)]
    pub extraction_amount: Option<String>,
    #[serde(default)]
    pub unaccounted: Option<String>,
    #[serde(default)]
    pub fines: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Source {
    pub display: String,
    #[serde(default)]
    pub short: Option<String>,
    #[serde(default)]
    pub url: String,
    #[serde(rename = "type", default)]
    pub source_type: String,
    #[serde(default)]
    pub access: Option<String>,
    #[serde(default)]
    pub search_path: Option<String>,
    #[serde(default)]
    pub tier: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BmfConnection {
    #[serde(default)]
    pub father: Option<String>,
    #[serde(default)]
    pub father_case: Option<String>,
    #[serde(default)]
    pub father_defendant_number: Option<u32>,
    #[serde(default)]
    pub aunt: Option<String>,
    #[serde(default)]
    pub aunt_role: Option<String>,
}

/// Parse config.toml and extract registries.
pub fn parse_config(text: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let parsed: toml::Value = toml::from_str(text)?;

    let extra = parsed
        .get("extra")
        .ok_or("config.toml has no [extra] section")?;

    let actors: BTreeMap<String, Actor> = extra
        .get("actors")
        .map(|v| toml::from_str(&toml::to_string(v).unwrap_or_default()))
        .transpose()?
        .unwrap_or_default();

    let entities: BTreeMap<String, Entity> = extra
        .get("entities")
        .map(|v| toml::from_str(&toml::to_string(v).unwrap_or_default()))
        .transpose()?
        .unwrap_or_default();

    let sources: BTreeMap<String, Source> = extra
        .get("sources")
        .map(|v| toml::from_str(&toml::to_string(v).unwrap_or_default()))
        .transpose()?
        .unwrap_or_default();

    let bmf: Option<BmfConnection> = extra
        .get("bmf")
        .map(|v| toml::from_str(&toml::to_string(v).unwrap_or_default()))
        .transpose()?;

    Ok(Config {
        actors,
        entities,
        sources,
        bmf,
    })
}
