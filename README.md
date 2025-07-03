# Demo MCP Server (Koa + JSON-RPC 2.0)

A minimal [Koa](https://koajs.com/) server that speaks the **Model Context Protocol** (MCP) via pure **JSON-RPC 2.0**.  
It exposes two methods:

* `server.manifest` – capability handshake  
* `context.provide` – returns demo “context chunks” based on a `topic` param

Use it as a learning scaffold or seed for richer MCP tools.

---

## Requirements

| Tool      | Version (tested) | Notes                                     |
|-----------|------------------|-------------------------------------------|
| Node.js   | ≥ 14 LTS         | ES‑module support via `"type": "module"`  |
| npm       | ≥ 8              | ships with Node 16+                       |
| Packages  | `koa`, `koa-bodyparser`, `json-rpc-2.0` |

---

## Installation

```bash
git clone git@github.com:jsamos/koa-mcp-demo.git
cd koa-mcp-demo
npm install
```

---

## Running the server

```bash
npm start     # or: node server.js
```

The server listens on **http://localhost:4000** (override with `PORT` env).

---

## JSON-RPC Endpoints

### 1. `server.manifest`

Handshake that advertises server capabilities.

```bash
curl -X POST http://localhost:4000/   -H "Content-Type: application/json"   -d '{"jsonrpc":"2.0","id":1,"method":"server.manifest"}'
```

**Response**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "name": "example-mcp-server-koa",
    "version": "0.0.1",
    "methods": ["context.provide"]
  }
}
```

### 2. `context.provide`

Returns a single demo chunk.

```bash
curl -X POST http://localhost:4000/   -H "Content-Type: application/json"   -d '{"jsonrpc":"2.0","id":2,"method":"context.provide","params":{"topic":"nextjs-routing"}}'
```

**Response**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "chunks": [
      {
        "text": "You asked for context on: nextjs-routing",
        "source": "demo"
      }
    ],
    "done": true
  }
}
```

---

## Project Structure

```
demo-mcp-koa/
├─ package.json
├─ server.js          # main Koa + JSON-RPC logic
└─ README.md
```

Because the repo’s `package.json` sets `"type": "module"`, every `.js` file is parsed as an **ES module**.  
If you need CommonJS compatibility, replace all `import … from` with `require()` and remove the `"type"` field.

---

## Extending the server

1. **Add new methods**

   ```js
   rpc.addMethod("context.search", async ({ query }) => { /* ... */ });
   ```

2. **Stream large outputs** by returning partial chunks with `done: false`, then a final chunk with `done: true`.

3. **Bidirectional workflows**: implement methods like `elicitation/create` once your client supports MCP’s interactive extensions.

---

## References

* [JSON‑RPC 2.0 Specification](https://www.jsonrpc.org/specification)
* [Node.js ES Modules docs](https://nodejs.org/api/esm.html)
* [`koa-bodyparser` on npm](https://www.npmjs.com/package/koa-bodyparser)
* [`json-rpc-2.0` on npm](https://www.npmjs.com/package/json-rpc-2.0)