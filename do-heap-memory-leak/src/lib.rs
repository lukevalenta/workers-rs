use wasm_bindgen::prelude::*;
use std::time::Duration;
#[allow(clippy::wildcard_imports)]
use worker::*;

#[event(fetch, respond_with_errors)]
async fn main(_req: Request, env: Env, _ctx: Context) -> Result<Response> {
    let ns = env.durable_object("MY_DURABLE_OBJECT")?;
    let id = ns.id_from_name("foo")?;
    let stub = id.get_stub()?;
    stub.fetch_with_str("http://example.com").await?;
    Response::ok(format!("Initialized durable object {}", id.to_string()))
}

#[durable_object]
struct MyDurableObject {
    state: State,
    _buffer: Vec<u8>,
}

impl DurableObject for MyDurableObject {
    fn new(state: State, _env: Env) -> Self {
        Self {
            state,
            _buffer: Vec::with_capacity(100_000_000)
         }
    }
    async fn fetch(&self, mut _req: Request) -> Result<Response> {
        self.state.storage().set_alarm(Duration::from_secs(1)).await?;
        console_log!("Scheduled alarm");
        Response::empty()
    }

    async fn alarm(&self) -> Result<Response> {
        // Wait long enough for the DO to hibernate.
        self.state
            .storage()
            .set_alarm(Duration::from_secs(10))
            .await?;

        console_log!("Alarm fired");

        Response::empty()
    }
}