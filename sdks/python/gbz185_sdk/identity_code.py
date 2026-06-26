from __future__ import annotations

from dataclasses import dataclass
import re

AGENT_IDENTITY_CODE_OID = "1.2.156.3088"
CURRENT_IDENTITY_CODE_VERSION = "1"
_NODE_RE = re.compile(r"^[0-9A-Z]+$", re.IGNORECASE)


class IdentityCodeError(ValueError):
    pass


@dataclass(frozen=True)
class AgentIdentityCodeParts:
    registration_service_provider: str
    registration_requester: str
    ontology_serial: str
    instance_serial: str
    oid: str = AGENT_IDENTITY_CODE_OID
    version: str = CURRENT_IDENTITY_CODE_VERSION


def _validate_node(value: str, name: str, max_length: int) -> None:
    if not value or len(value) > max_length or not _NODE_RE.match(value):
        raise IdentityCodeError(f"{name} must be 1-{max_length} base36 characters")


def validate_identity_code_parts(parts: AgentIdentityCodeParts) -> None:
    if parts.oid != AGENT_IDENTITY_CODE_OID:
        raise IdentityCodeError(f"Agent identity code OID must be {AGENT_IDENTITY_CODE_OID}")
    if parts.version != CURRENT_IDENTITY_CODE_VERSION:
        raise IdentityCodeError(f"Agent identity code version must be {CURRENT_IDENTITY_CODE_VERSION}")
    _validate_node(parts.registration_service_provider, "registrationServiceProvider", 6)
    _validate_node(parts.registration_requester, "registrationRequester", 6)
    _validate_node(parts.ontology_serial, "ontologySerial", 9)
    _validate_node(parts.instance_serial, "instanceSerial", 9)


def format_identity_code(parts: AgentIdentityCodeParts | dict[str, str]) -> str:
    if isinstance(parts, dict):
        parts = AgentIdentityCodeParts(
            oid=parts.get("oid", AGENT_IDENTITY_CODE_OID),
            version=parts.get("version", CURRENT_IDENTITY_CODE_VERSION),
            registration_service_provider=parts["registration_service_provider"],
            registration_requester=parts["registration_requester"],
            ontology_serial=parts["ontology_serial"],
            instance_serial=parts["instance_serial"],
        )

    normalized = AgentIdentityCodeParts(
        oid=parts.oid,
        version=parts.version,
        registration_service_provider=parts.registration_service_provider.upper(),
        registration_requester=parts.registration_requester.upper(),
        ontology_serial=parts.ontology_serial.upper(),
        instance_serial=parts.instance_serial.upper(),
    )
    validate_identity_code_parts(normalized)
    return ".".join(
        [
            normalized.oid,
            normalized.version,
            normalized.registration_service_provider,
            normalized.registration_requester,
            normalized.ontology_serial,
            normalized.instance_serial,
        ]
    )


def parse_identity_code(code: str) -> AgentIdentityCodeParts:
    segments = code.split(".")
    if len(segments) != 9:
        raise IdentityCodeError("Agent identity code must contain 9 dot-separated segments")

    oid = ".".join(segments[:4])
    if oid != AGENT_IDENTITY_CODE_OID:
        raise IdentityCodeError(f"Unsupported agent identity code OID: {oid}")

    version, provider, requester, ontology, instance = segments[4:]
    if version != CURRENT_IDENTITY_CODE_VERSION:
        raise IdentityCodeError(f"Unsupported agent identity code version: {version}")
    if not provider or not requester or not ontology or not instance:
        raise IdentityCodeError("Agent identity code is missing one or more required nodes")

    parts = AgentIdentityCodeParts(
        oid=AGENT_IDENTITY_CODE_OID,
        version=CURRENT_IDENTITY_CODE_VERSION,
        registration_service_provider=provider.upper(),
        registration_requester=requester.upper(),
        ontology_serial=ontology.upper(),
        instance_serial=instance.upper(),
    )
    validate_identity_code_parts(parts)
    return parts


def validate_identity_code(code: str) -> bool:
    try:
        parse_identity_code(code)
        return True
    except IdentityCodeError:
        return False
