import { OAuthProvider, AuthorizationError } from "@cloudflare/workers-oauth-provider";
import { WorkerEntrypoint } from "cloudflare:workers";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { buildServer } from "./mcp-server.js";

const WORKER_URL = "https://recepti-mcp.nikolakale-recepti.workers.dev";

class McpApiHandler extends WorkerEntrypoint {
  async fetch(request){
    const handler = createMcpHandler(() => buildServer(this.env));
    return handler.fetch(request);
  }
}

function loginPage({ actionUrl, error }){
  return `<!doctype html>
<html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moji recepti — prijava</title>
<style>
  body{ font-family: -apple-system, sans-serif; background:#FBF8F2; color:#262620; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
  form{ background:#fff; padding:32px; border-radius:18px; box-shadow:0 10px 30px rgba(0,0,0,0.1); width:100%; max-width:340px; }
  h1{ font-size:18px; margin:0 0 18px; }
  input{ width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #D8D0BA; border-radius:10px; font-size:15px; margin-bottom:12px; }
  button{ width:100%; padding:11px; border:none; border-radius:10px; background:#262620; color:#fff; font-size:15px; cursor:pointer; }
  .err{ color:#B4483C; font-size:13px; margin:-6px 0 12px; }
</style></head>
<body>
  <form method="POST" action="${actionUrl}">
    <h1>Pristup bazi recepata</h1>
    ${error ? `<div class="err">${error}</div>` : ""}
    <input type="password" name="passphrase" placeholder="Lozinka" autofocus required>
    <button type="submit">Autorizuj</button>
  </form>
</body></html>`;
}

const defaultHandler = {
  async fetch(request, env){
    const url = new URL(request.url);

    if (url.pathname === "/authorize"){
      let oauthRequest;
      try {
        oauthRequest = await env.OAUTH_PROVIDER.parseAuthRequest(request);
      } catch (error){
        if (!(error instanceof AuthorizationError)) throw error;
        if (!error.redirectUri) return new Response(error.description, { status: 400 });
        const redirect = new URL(error.redirectUri);
        redirect.searchParams.set("error", error.code);
        redirect.searchParams.set("error_description", error.description);
        if (error.state) redirect.searchParams.set("state", error.state);
        return Response.redirect(redirect.toString(), 302);
      }

      const client = await env.OAUTH_PROVIDER.lookupClient(oauthRequest.clientId);
      if (!client) return new Response("Nepoznat OAuth klijent.", { status: 400 });

      if (request.method === "GET"){
        return new Response(loginPage({ actionUrl: request.url }), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      if (request.method === "POST"){
        const form = await request.formData();
        const passphrase = form.get("passphrase");
        if (passphrase !== env.AUTH_PASSPHRASE){
          return new Response(loginPage({ actionUrl: request.url, error: "Pogrešna lozinka." }), {
            status: 401,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
        const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
          request: oauthRequest,
          userId: "nikola",
          metadata: { clientName: client.clientName || "recepti" },
          scope: oauthRequest.scope,
          props: { userId: "nikola" },
        });
        return Response.redirect(redirectTo, 302);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler: McpApiHandler,
  defaultHandler,

  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  clientRegistrationEndpoint: "/oauth/register",
  clientIdMetadataDocumentEnabled: true,

  scopesSupported: ["recipes"],
  resourceMetadata: {
    resource: `${WORKER_URL}/mcp`,
    authorization_servers: [WORKER_URL],
    scopes_supported: ["recipes"],
    resource_name: "Moji recepti",
  },
});
