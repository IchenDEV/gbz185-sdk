use crate::Result;

pub const AGENT_IDENTITY_CODE_OID: &str = "1.2.156.3088";
pub const CURRENT_IDENTITY_CODE_VERSION: &str = "1";

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AgentIdentityCodeParts {
    pub oid: String,
    pub version: String,
    pub registration_service_provider: String,
    pub registration_requester: String,
    pub ontology_serial: String,
    pub instance_serial: String,
}

impl AgentIdentityCodeParts {
    pub fn new(provider: &str, requester: &str, ontology: &str, instance: &str) -> Self {
        Self {
            oid: AGENT_IDENTITY_CODE_OID.to_string(),
            version: CURRENT_IDENTITY_CODE_VERSION.to_string(),
            registration_service_provider: provider.to_string(),
            registration_requester: requester.to_string(),
            ontology_serial: ontology.to_string(),
            instance_serial: instance.to_string(),
        }
    }
}

fn validate_node(value: &str, name: &str, max_length: usize) -> Result<()> {
    let valid = !value.is_empty()
        && value.len() <= max_length
        && value.chars().all(|ch| ch.is_ascii_alphanumeric());
    if !valid {
        return Err(format!("{name} must be 1-{max_length} base36 characters").into());
    }
    Ok(())
}

pub fn validate_identity_code_parts(parts: &AgentIdentityCodeParts) -> Result<()> {
    if parts.oid != AGENT_IDENTITY_CODE_OID {
        return Err(format!("agent identity code OID must be {AGENT_IDENTITY_CODE_OID}").into());
    }
    if parts.version != CURRENT_IDENTITY_CODE_VERSION {
        return Err(
            format!("agent identity code version must be {CURRENT_IDENTITY_CODE_VERSION}").into(),
        );
    }
    validate_node(
        &parts.registration_service_provider,
        "registrationServiceProvider",
        6,
    )?;
    validate_node(&parts.registration_requester, "registrationRequester", 6)?;
    validate_node(&parts.ontology_serial, "ontologySerial", 9)?;
    validate_node(&parts.instance_serial, "instanceSerial", 9)
}

pub fn format_identity_code(parts: &AgentIdentityCodeParts) -> Result<String> {
    let normalized = AgentIdentityCodeParts {
        oid: if parts.oid.is_empty() {
            AGENT_IDENTITY_CODE_OID.to_string()
        } else {
            parts.oid.clone()
        },
        version: if parts.version.is_empty() {
            CURRENT_IDENTITY_CODE_VERSION.to_string()
        } else {
            parts.version.clone()
        },
        registration_service_provider: parts.registration_service_provider.to_ascii_uppercase(),
        registration_requester: parts.registration_requester.to_ascii_uppercase(),
        ontology_serial: parts.ontology_serial.to_ascii_uppercase(),
        instance_serial: parts.instance_serial.to_ascii_uppercase(),
    };
    validate_identity_code_parts(&normalized)?;
    Ok([
        normalized.oid,
        normalized.version,
        normalized.registration_service_provider,
        normalized.registration_requester,
        normalized.ontology_serial,
        normalized.instance_serial,
    ]
    .join("."))
}

pub fn parse_identity_code(code: &str) -> Result<AgentIdentityCodeParts> {
    let segments: Vec<&str> = code.split('.').collect();
    if segments.len() != 9 {
        return Err("agent identity code must contain 9 dot-separated segments".into());
    }
    let oid = segments[0..4].join(".");
    if oid != AGENT_IDENTITY_CODE_OID {
        return Err(format!("unsupported agent identity code OID: {oid}").into());
    }
    let version = segments[4];
    if version != CURRENT_IDENTITY_CODE_VERSION {
        return Err(format!("unsupported agent identity code version: {version}").into());
    }
    let parts = AgentIdentityCodeParts {
        oid: AGENT_IDENTITY_CODE_OID.to_string(),
        version: CURRENT_IDENTITY_CODE_VERSION.to_string(),
        registration_service_provider: segments[5].to_ascii_uppercase(),
        registration_requester: segments[6].to_ascii_uppercase(),
        ontology_serial: segments[7].to_ascii_uppercase(),
        instance_serial: segments[8].to_ascii_uppercase(),
    };
    validate_identity_code_parts(&parts)?;
    Ok(parts)
}

pub fn validate_identity_code(code: &str) -> bool {
    parse_identity_code(code).is_ok()
}
