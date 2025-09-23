import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
        this.storage = ctx.storage;
	}

	async fetch() {
    	await this.storage.setAlarm(Date.now() + 1);
		return new Response();
	}

    async alarm() {
        await this.storage.setAlarm(Date.now() + 1000);
        console.log("Alarm fired");
    }
}

export default {
	async fetch(request, env, ctx) {
		const id = env.MY_DURABLE_OBJECT.idFromName("foo");
		const stub = env.MY_DURABLE_OBJECT.get(id);
		await stub.fetch("http://example.com");
        return new Response('Initialized Durable Object ' + id);
	}
};