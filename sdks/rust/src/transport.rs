use crate::Result;
use serde_json::{json, Value};
use std::cell::RefCell;
use std::collections::HashMap;

pub trait JsonTransport {
    fn request(&self, operation: &str, payload: Value) -> Result<Value>;
}

type Handler = Box<dyn Fn(Value) -> Result<Value>>;

#[derive(Default)]
pub struct InProcessJsonTransport {
    handlers: RefCell<HashMap<String, Handler>>,
}

impl InProcessJsonTransport {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn register<F>(&self, operation: &str, handler: F)
    where
        F: Fn(Value) -> Result<Value> + 'static,
    {
        self.handlers
            .borrow_mut()
            .insert(operation.to_string(), Box::new(handler));
    }
}

impl JsonTransport for InProcessJsonTransport {
    fn request(&self, operation: &str, payload: Value) -> Result<Value> {
        let handlers = self.handlers.borrow();
        let handler = handlers.get(operation).ok_or_else(|| {
            format!("no JSON transport handler registered for operation: {operation}")
        })?;
        handler(payload)
    }
}

pub struct HttpJsonTransport {
    pub endpoint: String,
    pub headers: HashMap<String, String>,
}

impl HttpJsonTransport {
    pub fn new(endpoint: impl Into<String>) -> Self {
        Self {
            endpoint: endpoint.into(),
            headers: HashMap::new(),
        }
    }

    pub fn with_header(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.insert(key.into(), value.into());
        self
    }
}

impl JsonTransport for HttpJsonTransport {
    fn request(&self, operation: &str, payload: Value) -> Result<Value> {
        let mut req = ureq::post(&self.endpoint).set("content-type", "application/json");
        for (key, value) in &self.headers {
            req = req.set(key, value);
        }
        let response = req.send_json(json!({ "operation": operation, "payload": payload }))?;
        let value: Value = response.into_json()?;
        Ok(value)
    }
}
