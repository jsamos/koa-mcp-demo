import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { JSONRPCServer } from "json-rpc-2.0";

const app = new Koa();
app.use(bodyParser());         // populate ctx.request.body

const rpc = new JSONRPCServer();

/* Mandatory handshake */
rpc.addMethod("server.manifest", () => ({
  name: "example-mcp-server-koa",
  version: "0.0.1",
  methods: ["context.provide"]
}));

/* Simplest context method */
rpc.addMethod("context.provide", ({ topic }) => ({
  chunks: [
    { text: `You asked for context on: ${topic}`, source: "demo" }
  ],
  done: true
}));

rpc.addMethod("elicitation/create", ({ message }) => ({
    action: "accept",
    content: { answer: "42" }
}));
  

/* Wire the dispatcher to every POST */
app.use(async ctx => {
  if (ctx.method !== "POST") { 
    ctx.status = 405; return; 
  }
  const response = await rpc.receive(ctx.request.body);
  if (response) { 
    ctx.body = response;
  } else {
    ctx.status = 204; 
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`MCP server (Koa) listening on http://localhost:${PORT}`)
);
