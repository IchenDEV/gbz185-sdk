import unittest

from gbz185_sdk import (
    AgentInterconnectClient,
    AgentIdentityCodeParts,
    GBZ185_FRAI_INTERFACES,
    GBZ185_FUNCTIONS,
    InProcessJsonTransport,
    format_identity_code,
    parse_identity_code,
    validate_identity_code,
)


class PythonSdkTest(unittest.TestCase):
    def test_identity_code(self) -> None:
        code = format_identity_code(
            AgentIdentityCodeParts(
                registration_service_provider="a1",
                registration_requester="req001",
                ontology_serial="calendar",
                instance_serial="1",
            )
        )
        self.assertEqual(code, "1.2.156.3088.1.A1.REQ001.CALENDAR.1")
        self.assertTrue(validate_identity_code(code))
        self.assertEqual(parse_identity_code(code).registration_requester, "REQ001")
        self.assertFalse(validate_identity_code("1.2.156.9999.1.A1.REQ001.CALENDAR.1"))

    def test_client_uses_standard_operations(self) -> None:
        transport = InProcessJsonTransport()
        seen = []
        transport.register("discovery.discover", lambda payload: seen.append(payload) or [{"score": 1}])
        client = AgentInterconnectClient(transport)
        result = client.discover({"text": "calendar"})
        self.assertEqual(result[0]["score"], 1)
        self.assertEqual(seen, [{"text": "calendar"}])

    def test_conformance_counts(self) -> None:
        self.assertEqual(len(GBZ185_FUNCTIONS), 12)
        self.assertEqual(len(GBZ185_FRAI_INTERFACES), 10)


if __name__ == "__main__":
    unittest.main()
