import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
        this.storage = ctx.storage;
		this.buffer = new Uint8Array(10_000_000)
	}

	async fetch() {
		await this.storage.setAlarm(Date.now() + 1);
		return new Response();
	}

    async alarm() {
        // Wait long enough for the DO to hibernate.
        await this.storage.setAlarm(Date.now() + 15 * 1000);
    }
}

export default {
	async fetch(request, env, ctx) {
		const id = env.MY_DURABLE_OBJECT.idFromName("foo");
		const stub = env.MY_DURABLE_OBJECT.get(id);
		await stub.fetch("http://example.com");
        return new Response('Initialized Durable Object ' + id);
	},
};