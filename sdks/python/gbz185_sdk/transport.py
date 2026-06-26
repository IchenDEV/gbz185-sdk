from __future__ import annotations

from abc import ABC, abstractmethod
import json
from typing import Any, Callable
from urllib import request

JsonValue = Any
JsonOperationHandler = Callable[[JsonValue], JsonValue]


class JsonTransport(ABC):
    @abstractmethod
    def request(self, operation: str, payload: JsonValue) -> JsonValue:
        raise NotImplementedError


class InProcessJsonTransport(JsonTransport):
    def __init__(self) -> None:
        self._handlers: dict[str, JsonOperationHandler] = {}

    def register(self, operation: str, handler: JsonOperationHandler) -> None:
        self._handlers[operation] = handler

    def request(self, operation: str, payload: JsonValue) -> JsonValue:
        if operation not in self._handlers:
            raise KeyError(f"No JSON transport handler registered for operation: {operation}")
        return self._handlers[operation](payload)


class HttpJsonTransport(JsonTransport):
    def __init__(self, endpoint: str, headers: dict[str, str] | None = None, timeout: float = 30.0) -> None:
        self.endpoint = endpoint
        self.headers = headers or {}
        self.timeout = timeout

    def request(self, operation: str, payload: JsonValue) -> JsonValue:
        body = json.dumps({"operation": operation, "payload": payload}).encode("utf-8")
        headers = {"content-type": "application/json", **self.headers}
        req = request.Request(self.endpoint, data=body, headers=headers, method="POST")
        with request.urlopen(req, timeout=self.timeout) as response:
            return json.loads(response.read().decode("utf-8"))
