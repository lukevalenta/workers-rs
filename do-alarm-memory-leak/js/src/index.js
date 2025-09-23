import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
        this.storage = ctx.storage;
	}

	async fetch() {
        this.storage.setAlarm(Date.now() + 1);
		return new Response();
	}

    async alarm() {
        this.storage.setAlarm(Date.now() + 1000);
        console.log("Alarm fired");
    }
}

export default {
	async fetch(request, env, ctx) {
    console.log('fetch');
		const id = env.MY_DURABLE_OBJECT.idFromName("foo");
		const stub = env.MY_DURABLE_OBJECT.get(id);
		await stub.fetch("http://example.com");
        return new Response('Initialized Durable Object ' + id)
	},
};