import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8181";

function Card({ title, children }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

function CodeBlock({ data }) {
  return (
    <pre style={{ background: "#0b1020", color: "#e6e6e6", padding: 12, borderRadius: 10, overflowX: "auto" }}>
      {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
    </pre>
  );
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, json: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, json: { raw: text } };
  }
}

export default function App() {
  const [loading, setLoading] = useState(false);

  // Health
  const [healthResp, setHealthResp] = useState(null);

  // Hello
  const [helloName, setHelloName] = useState("Nihar");
  const [helloResp, setHelloResp] = useState(null);

  // User Story Generator
  const [product, setProduct] = useState("Claims Portal");
  const [primaryUser, setPrimaryUser] = useState("Customer");
  const [priority, setPriority] = useState("High");
  const [maxStories, setMaxStories] = useState(3);
  const [requirementsText, setRequirementsText] = useState(
    "User should upload documents.\nSystem must validate file type and size.\nProvide status updates and email notifications."
  );
  const [storyResp, setStoryResp] = useState(null);

  const endpoints = useMemo(
    () => ({
      health: `${API_BASE}/health`,
      hello: `${API_BASE}/api/hello`,
      stories: `${API_BASE}/api/user-stories/generate`,
      swagger: `${API_BASE}/docs`,
      redoc: `${API_BASE}/redoc`,
    }),
    []
  );

  const callHealth = async () => {
    setLoading(true);
    setHealthResp(null);
    try {
      const res = await fetch(endpoints.health);
      const out = await safeJson(res);
      setHealthResp(out);
    } catch (e) {
      setHealthResp({ ok: false, status: 0, json: { error: String(e) } });
    } finally {
      setLoading(false);
    }
  };

  const callHello = async () => {
    setLoading(true);
    setHelloResp(null);
    try {
      const url = new URL(endpoints.hello);
      url.searchParams.set("name", helloName || "world");
      const res = await fetch(url.toString());
      const out = await safeJson(res);
      setHelloResp(out);
    } catch (e) {
      setHelloResp({ ok: false, status: 0, json: { error: String(e) } });
    } finally {
      setLoading(false);
    }
  };

  const callStoryGen = async () => {
    setLoading(true);
    setStoryResp(null);
    try {
      const payload = {
        product,
        primary_user: primaryUser,
        priority,
        max_stories: Number(maxStories),
        requirements_text: requirementsText,
      };

      const res = await fetch(endpoints.stories, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const out = await safeJson(res);
      setStoryResp(out);
    } catch (e) {
      setStoryResp({ ok: false, status: 0, json: { error: String(e) } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: "0 16px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ marginBottom: 6 }}>FastAPI Tester UI</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        API Base: <b>{API_BASE}</b> |{" "}
        <a href={endpoints.swagger} target="_blank" rel="noreferrer">Swagger</a>{" "}
        |{" "}
        <a href={endpoints.redoc} target="_blank" rel="noreferrer">ReDoc</a>
      </p>

      <Card title="1) Health Check">
        <button onClick={callHealth} disabled={loading} style={{ padding: "10px 14px", borderRadius: 10 }}>
          Call /health
        </button>

        {healthResp && (
          <>
            <p>Status: <b>{healthResp.status}</b> | OK: <b>{String(healthResp.ok)}</b></p>
            <CodeBlock data={healthResp.json} />
          </>
        )}
      </Card>

      <Card title="2) Hello API">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={helloName}
            onChange={(e) => setHelloName(e.target.value)}
            placeholder="name"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", minWidth: 220 }}
          />
          <button onClick={callHello} disabled={loading} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Call /api/hello
          </button>
        </div>

        {helloResp && (
          <>
            <p>Status: <b>{helloResp.status}</b> | OK: <b>{String(helloResp.ok)}</b></p>
            <CodeBlock data={helloResp.json} />
          </>
        )}
      </Card>

      <Card title="3) User Story Generator">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Product</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Primary User</label>
            <input
              value={primaryUser}
              onChange={(e) => setPrimaryUser(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label>Max Stories</label>
            <input
              type="number"
              min={1}
              max={10}
              value={maxStories}
              onChange={(e) => setMaxStories(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Requirements Text</label>
          <textarea
            value={requirementsText}
            onChange={(e) => setRequirementsText(e.target.value)}
            rows={7}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button onClick={callStoryGen} disabled={loading} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Generate User Stories
          </button>
        </div>

        {storyResp && (
          <>
            <p style={{ marginTop: 12 }}>Status: <b>{storyResp.status}</b> | OK: <b>{String(storyResp.ok)}</b></p>
            <CodeBlock data={storyResp.json} />
          </>
        )}
      </Card>

      <p style={{ color: "#666" }}>
        Tip: If calls fail with CORS, enable CORS in FastAPI (I can paste the exact snippet).
      </p>
    </div>
  );
}
