#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct FunctionDescriptor {
    pub domain: &'static str,
    pub function: &'static str,
    pub sdk: &'static str,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct FraiInterfaceDescriptor {
    pub id: &'static str,
    pub from: &'static str,
    pub to: &'static str,
}

pub const GBZ185_FUNCTIONS: [FunctionDescriptor; 12] = [
    FunctionDescriptor {
        domain: "agent",
        function: "agent identity maintenance",
        sdk: "AgentIdentityMaintenance",
    },
    FunctionDescriptor {
        domain: "agent",
        function: "agent description maintenance",
        sdk: "AgentDescriptionMaintenance",
    },
    FunctionDescriptor {
        domain: "agent",
        function: "agent interconnection authorization",
        sdk: "InterconnectionAuthorizationRuntime",
    },
    FunctionDescriptor {
        domain: "agent",
        function: "agent interaction",
        sdk: "InteractionRuntime",
    },
    FunctionDescriptor {
        domain: "agent",
        function: "tool access",
        sdk: "ToolAccessRuntime",
    },
    FunctionDescriptor {
        domain: "management",
        function: "agent identity management",
        sdk: "IdentityRegistryRuntime",
    },
    FunctionDescriptor {
        domain: "management",
        function: "agent credential management",
        sdk: "CredentialIssuer",
    },
    FunctionDescriptor {
        domain: "management",
        function: "agent identity authentication",
        sdk: "CredentialVerifier",
    },
    FunctionDescriptor {
        domain: "interconnection",
        function: "agent description management",
        sdk: "AgentDescriptionRegistry",
    },
    FunctionDescriptor {
        domain: "interconnection",
        function: "agent discovery",
        sdk: "DiscoveryService",
    },
    FunctionDescriptor {
        domain: "interconnection",
        function: "message distribution",
        sdk: "MessageDistributionRuntime",
    },
    FunctionDescriptor {
        domain: "resource",
        function: "tool service",
        sdk: "ToolRuntime",
    },
];

pub const GBZ185_FRAI_INTERFACES: [FraiInterfaceDescriptor; 10] = [
    FraiInterfaceDescriptor {
        id: "FRAI-01",
        from: "agent identity maintenance",
        to: "agent identity management",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-02",
        from: "agent identity maintenance",
        to: "agent credential management",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-03",
        from: "agent interconnection authorization",
        to: "agent identity authentication",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-04",
        from: "agent identity management",
        to: "agent credential management",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-05",
        from: "agent credential management",
        to: "agent identity authentication",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-06",
        from: "agent description maintenance",
        to: "agent description management",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-07",
        from: "agent description management",
        to: "agent discovery",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-08",
        from: "agent interaction",
        to: "agent interaction",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-09",
        from: "agent interaction",
        to: "message distribution",
    },
    FraiInterfaceDescriptor {
        id: "FRAI-10",
        from: "tool access",
        to: "tool service",
    },
];

#[cfg(test)]
mod tests {
    use crate::{
        format_identity_code, parse_identity_code, validate_identity_code, AgentIdentityCodeParts,
        AgentInterconnectClient, InProcessJsonTransport, GBZ185_FRAI_INTERFACES, GBZ185_FUNCTIONS,
    };
    use serde_json::json;

    #[test]
    fn identity_code_round_trip() {
        let parts = AgentIdentityCodeParts::new("a1", "req001", "calendar", "1");
        let code = format_identity_code(&parts).unwrap();
        assert_eq!(code, "1.2.156.3088.1.A1.REQ001.CALENDAR.1");
        assert!(validate_identity_code(&code));
        assert_eq!(
            parse_identity_code(&code).unwrap().registration_requester,
            "REQ001"
        );
        assert!(!validate_identity_code(
            "1.2.156.9999.1.A1.REQ001.CALENDAR.1"
        ));
    }

    #[test]
    fn client_uses_standard_operations() {
        let transport = InProcessJsonTransport::new();
        transport.register("discovery.discover", |payload| {
            Ok(json!([{ "score": 1, "payload": payload }]))
        });
        let client = AgentInterconnectClient::new(transport);
        let result = client.discover(json!({ "text": "calendar" })).unwrap();
        assert_eq!(result[0]["score"], 1);
    }

    #[test]
    fn conformance_counts() {
        assert_eq!(GBZ185_FUNCTIONS.len(), 12);
        assert_eq!(GBZ185_FRAI_INTERFACES.len(), 10);
    }
}
