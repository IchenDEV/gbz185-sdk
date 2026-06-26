package gbz185

import (
	"context"
	"testing"
)

func TestIdentityCode(t *testing.T) {
	code, err := FormatIdentityCode(AgentIdentityCodeParts{
		RegistrationServiceProvider: "a1",
		RegistrationRequester:       "req001",
		OntologySerial:              "calendar",
		InstanceSerial:              "1",
	})
	if err != nil {
		t.Fatal(err)
	}
	if code != "1.2.156.3088.1.A1.REQ001.CALENDAR.1" {
		t.Fatalf("unexpected code: %s", code)
	}
	if !ValidateIdentityCode(code) {
		t.Fatalf("expected valid identity code")
	}
	parts, err := ParseIdentityCode(code)
	if err != nil {
		t.Fatal(err)
	}
	if parts.RegistrationRequester != "REQ001" {
		t.Fatalf("unexpected requester: %s", parts.RegistrationRequester)
	}
	if ValidateIdentityCode("1.2.156.9999.1.A1.REQ001.CALENDAR.1") {
		t.Fatalf("expected invalid OID")
	}
}

func TestClientUsesStandardOperation(t *testing.T) {
	transport := NewInProcessJsonTransport()
	transport.Register("discovery.discover", func(ctx context.Context, payload any) (any, error) {
		return []JSONObject{{"score": 1, "payload": payload}}, nil
	})
	client := NewAgentInterconnectClient(transport)
	var out []JSONObject
	if err := client.Discover(context.Background(), JSONObject{"text": "calendar"}, &out); err != nil {
		t.Fatal(err)
	}
	if len(out) != 1 || out[0]["score"].(float64) != 1 {
		t.Fatalf("unexpected output: %#v", out)
	}
}

func TestConformanceCounts(t *testing.T) {
	if len(GBZ185Functions) != 12 {
		t.Fatalf("expected 12 functions")
	}
	if len(GBZ185FraiInterfaces) != 10 {
		t.Fatalf("expected 10 FRAI interfaces")
	}
}
