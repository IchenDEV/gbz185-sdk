package gbz185

import (
	"fmt"
	"regexp"
	"strings"
)

const AgentIdentityCodeOID = "1.2.156.3088"
const CurrentIdentityCodeVersion = "1"

var identityCodeNodeRE = regexp.MustCompile(`^[0-9A-Z]+$`)

type AgentIdentityCodeParts struct {
	OID                         string
	Version                     string
	RegistrationServiceProvider string
	RegistrationRequester       string
	OntologySerial              string
	InstanceSerial              string
}

func validateNode(value string, name string, maxLength int) error {
	if value == "" || len(value) > maxLength || !identityCodeNodeRE.MatchString(strings.ToUpper(value)) {
		return fmt.Errorf("%s must be 1-%d base36 characters", name, maxLength)
	}
	return nil
}

func ValidateIdentityCodeParts(parts AgentIdentityCodeParts) error {
	if parts.OID == "" {
		parts.OID = AgentIdentityCodeOID
	}
	if parts.Version == "" {
		parts.Version = CurrentIdentityCodeVersion
	}
	if parts.OID != AgentIdentityCodeOID {
		return fmt.Errorf("agent identity code OID must be %s", AgentIdentityCodeOID)
	}
	if parts.Version != CurrentIdentityCodeVersion {
		return fmt.Errorf("agent identity code version must be %s", CurrentIdentityCodeVersion)
	}
	if err := validateNode(parts.RegistrationServiceProvider, "registrationServiceProvider", 6); err != nil {
		return err
	}
	if err := validateNode(parts.RegistrationRequester, "registrationRequester", 6); err != nil {
		return err
	}
	if err := validateNode(parts.OntologySerial, "ontologySerial", 9); err != nil {
		return err
	}
	return validateNode(parts.InstanceSerial, "instanceSerial", 9)
}

func FormatIdentityCode(parts AgentIdentityCodeParts) (string, error) {
	if parts.OID == "" {
		parts.OID = AgentIdentityCodeOID
	}
	if parts.Version == "" {
		parts.Version = CurrentIdentityCodeVersion
	}
	parts.RegistrationServiceProvider = strings.ToUpper(parts.RegistrationServiceProvider)
	parts.RegistrationRequester = strings.ToUpper(parts.RegistrationRequester)
	parts.OntologySerial = strings.ToUpper(parts.OntologySerial)
	parts.InstanceSerial = strings.ToUpper(parts.InstanceSerial)

	if err := ValidateIdentityCodeParts(parts); err != nil {
		return "", err
	}
	return strings.Join([]string{
		parts.OID,
		parts.Version,
		parts.RegistrationServiceProvider,
		parts.RegistrationRequester,
		parts.OntologySerial,
		parts.InstanceSerial,
	}, "."), nil
}

func ParseIdentityCode(code string) (AgentIdentityCodeParts, error) {
	segments := strings.Split(code, ".")
	if len(segments) != 9 {
		return AgentIdentityCodeParts{}, fmt.Errorf("agent identity code must contain 9 dot-separated segments")
	}
	oid := strings.Join(segments[:4], ".")
	if oid != AgentIdentityCodeOID {
		return AgentIdentityCodeParts{}, fmt.Errorf("unsupported agent identity code OID: %s", oid)
	}
	version := segments[4]
	if version != CurrentIdentityCodeVersion {
		return AgentIdentityCodeParts{}, fmt.Errorf("unsupported agent identity code version: %s", version)
	}
	parts := AgentIdentityCodeParts{
		OID:                         AgentIdentityCodeOID,
		Version:                     CurrentIdentityCodeVersion,
		RegistrationServiceProvider: strings.ToUpper(segments[5]),
		RegistrationRequester:       strings.ToUpper(segments[6]),
		OntologySerial:              strings.ToUpper(segments[7]),
		InstanceSerial:              strings.ToUpper(segments[8]),
	}
	if err := ValidateIdentityCodeParts(parts); err != nil {
		return AgentIdentityCodeParts{}, err
	}
	return parts, nil
}

func ValidateIdentityCode(code string) bool {
	_, err := ParseIdentityCode(code)
	return err == nil
}
