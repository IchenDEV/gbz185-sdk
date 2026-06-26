pub mod client;
pub mod conformance;
pub mod identity_code;
pub mod transport;

pub use client::AgentInterconnectClient;
pub use conformance::{
    FraiInterfaceDescriptor, FunctionDescriptor, GBZ185_FRAI_INTERFACES, GBZ185_FUNCTIONS,
};
pub use identity_code::{
    format_identity_code, parse_identity_code, validate_identity_code,
    validate_identity_code_parts, AgentIdentityCodeParts, AGENT_IDENTITY_CODE_OID,
    CURRENT_IDENTITY_CODE_VERSION,
};
pub use transport::{HttpJsonTransport, InProcessJsonTransport, JsonTransport};

pub type Error = Box<dyn std::error::Error + Send + Sync>;
pub type Result<T> = std::result::Result<T, Error>;
