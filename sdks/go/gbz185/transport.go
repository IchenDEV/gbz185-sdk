package gbz185

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type JSONValue = any
type JSONObject = map[string]any

type JsonTransport interface {
	Request(ctx context.Context, operation string, payload any, out any) error
}

type JsonOperationHandler func(ctx context.Context, payload any) (any, error)

type InProcessJsonTransport struct {
	handlers map[string]JsonOperationHandler
}

func NewInProcessJsonTransport() *InProcessJsonTransport {
	return &InProcessJsonTransport{handlers: map[string]JsonOperationHandler{}}
}

func (t *InProcessJsonTransport) Register(operation string, handler JsonOperationHandler) {
	t.handlers[operation] = handler
}

func (t *InProcessJsonTransport) Request(ctx context.Context, operation string, payload any, out any) error {
	handler, ok := t.handlers[operation]
	if !ok {
		return fmt.Errorf("no JSON transport handler registered for operation: %s", operation)
	}
	result, err := handler(ctx, payload)
	if err != nil {
		return err
	}
	if out == nil {
		return nil
	}
	data, err := json.Marshal(result)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, out)
}

type HttpJsonTransport struct {
	Endpoint string
	Headers  map[string]string
	Client   *http.Client
}

func (t *HttpJsonTransport) Request(ctx context.Context, operation string, payload any, out any) error {
	body, err := json.Marshal(JSONObject{"operation": operation, "payload": payload})
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, t.Endpoint, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("content-type", "application/json")
	for key, value := range t.Headers {
		req.Header.Set(key, value)
	}
	client := t.Client
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("HTTP JSON transport failed: %s", resp.Status)
	}
	if out == nil {
		return nil
	}
	return json.NewDecoder(resp.Body).Decode(out)
}
