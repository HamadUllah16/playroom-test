"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

type Tool = {
  name: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
};

export default function POC() {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [pageSlug, setPageSlug] = useState<string>("");
  useEffect(() => {
    const run = async () => {
      const endpoint = new URL("/docs/api/mcp", window.location.origin);
      const transport = new StreamableHTTPClientTransport(endpoint);
      const client = new Client({ name: "TestClient", version: "1.0.0" });
      await client.connect(transport);
      clientRef.current = client;
      setConnected(true);
    };
    run().catch((err) => console.error(err));
    return () => {
      if (clientRef.current) {
        void clientRef.current.close().catch(() => {});
        clientRef.current = null;
      }
    };
  }, []);

  const fetchTools = async () => {
    if (!clientRef.current) return;
    try {
      setLoading(true);
      const result = await clientRef.current.listTools();
      setTools((result).tools ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const callTool = async (name: string) => {
    if (!clientRef.current) return;
    try {
      setErrorText("");
      setResultText("");
      setCalling(name);
      if (name === "docs_page" && !pageSlug) {
        setErrorText("Please enter a page slug before calling this tool.");
        return;
      }
      const params = name === "docs_page" ? { page: pageSlug } : {};
      const result = await clientRef.current.callTool({ name, arguments: params });
      if (result?.structuredContent) {
        setResultText(JSON.stringify(result.structuredContent, null, 2));
      } else if (Array.isArray(result?.content)) {
        const txt = result.content
          .map((c) => (c?.type === "text" ? c.text : JSON.stringify(c)))
          .join("\n");
        setResultText(txt);
      } else {
        setResultText(JSON.stringify(result ?? {}, null, 2));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCalling(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span>Status: {connected ? "Connected" : "Disconnected"}</span>
        <button onClick={fetchTools} disabled={!connected || loading}>
          {loading ? "Loading tools…" : "Fetch tools"}
        </button>
      </div>

      <div>
        <h3 style={{ margin: 0 }}>Current tools</h3>
        {tools.length === 0 ? (
          <p style={{ marginTop: 8 }}>No tools loaded. Click Fetch tools.</p>
        ) : (
          <ul style={{ marginTop: 8 }}>
            {tools.map((t) => (
              <li key={t.name} style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <strong>{t.name}</strong>
                  {t.description ? <span>— {t.description}</span> : null}
                  {t.name === "docs_page" ? (
                    <input
                      placeholder="slug e.g. quick-start/setting-up-playroomkit"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      style={{ flex: 1, minWidth: 240 }}
                    />
                  ) : null}
                  <button onClick={() => callTool(t.name)} disabled={!connected || calling === t.name || (t.name === "docs_page" && !pageSlug)}>
                    {calling === t.name ? "Calling…" : "Call"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(resultText || errorText) && (
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0 }}>Tool response</h3>
          {errorText ? (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "crimson" }}>{errorText}</pre>
          ) : (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{resultText}</pre>
          )}
        </div>
      )}
    </div>
  );
}
