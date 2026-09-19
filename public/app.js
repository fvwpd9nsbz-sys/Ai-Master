const chat = document.querySelector("#chat");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const status = document.querySelector("#status");

function add(text, type, meta = "") {
  const div = document.createElement("div");
  div.className = "bubble " + type;
  div.textContent = text + (meta ? "\n\n" + meta : "");
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function health() {
  try {
    const r = await fetch("/api/health");
    const data = await r.json();
    status.textContent = data.providerConfigured ? "AI online" : "Setup needed";
  } catch {
    status.textContent = "Offline";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  add(message, "user");
  add("Thinking…", "ai");

  const thinking = chat.lastElementChild;
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message})
    });
    const data = await r.json();
    thinking.remove();
    if (!r.ok) throw new Error(data.error || "Request failed");
    add(data.text, "ai", `Route: ${data.route} · ${data.provider} · ${data.model}`);
  } catch (err) {
    thinking.remove();
    add("Error: " + err.message, "ai");
  }
});

health();
