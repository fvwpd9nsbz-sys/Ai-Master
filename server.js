const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

function chooseRoute(message) {
  const text = String(message || "").toLowerCase();
  if (/(code|debug|javascript|python|swift|lua|roblox|minecraft)/.test(text)) return "coding";
  if (/(image|picture|draw|logo)/.test(text)) return "creative";
  if (/(search|latest|today|news)/.test(text)) return "web";
  return "general";
}

async function callOpenAI(messages) {
  if (!OPENAI_API_KEY) {
    return {
      provider: "demo",
      model: "not-configured",
      text: "Ai Master is running, but no AI provider key is configured yet. Set OPENAI_API_KEY on the server to enable live responses."
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages, temperature: 0.4 })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "AI provider request failed");

  return {
    provider: "OpenAI",
    model: data.model || OPENAI_MODEL,
    text: data.choices?.[0]?.message?.content || "No response."
  };
}

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "Message is required." });

    const route = chooseRoute(message);
    const system = [
      "You are Ai Master, a general-purpose AI orchestrator.",
      "Be accurate, concise, and transparent about capabilities.",
      "If multiple providers are configured, the router may compare their answers before responding.",
      "Never claim an external action happened unless it actually happened."
    ].join(" ");

    const result = await callOpenAI([
      { role: "system", content: system },
      { role: "user", content: message }
    ]);

    res.json({ route, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected server error." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "Ai Master", providerConfigured: Boolean(OPENAI_API_KEY) });
});

app.listen(PORT, () => {
  console.log(`Ai Master listening on http://localhost:${PORT}`);
});