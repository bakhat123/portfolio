import { NextResponse } from "next/server";
import profile from "@/data/profile.json";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

function toLower(str: string): string {
  return str.toLowerCase();
}

function answerFromProfile(question: string): string {
  const q = toLower(question);

  if (q.includes("name")) {
    return `His name is ${profile.name}.`;
  }

  if (
    q.includes("bakhat") ||
    q.includes("muhammad") ||
    q.includes("nasar") ||
    q.includes("about bakhat") ||
    q.includes("who is bakhat") ||
    q.includes("who is muhammad") ||
    q.includes("bio of bakhat")
  ) {
    return `${profile.bio}`;
  }

  if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
    return `Key skills: ${profile.skills.join(", ")}.`;
  }

  if (q.includes("project")) {
    const lines = profile.projects.map((p, i) => `${i + 1}. ${p.title} — ${p.desc}`);
    return lines.join("\n");
  }

  if (q.includes("goal") || q.includes("future")) {
    return `Goals: ${profile.goals.join(", ")}.`;
  }

  // Avoid matching "fun" inside words like "function"
  if (/\b(hobby|hobbies|fun)\b/.test(q)) {
    return `Hobbies: ${profile.hobbies.join(", ")}.`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("github")) {
    const c = profile.contact;
    return `Contact: email ${c.email}. GitHub ${c.github}. LinkedIn ${c.linkedin}.`;
  }

  if (q.includes("strongest") || q.includes("strength")) {
    return `Strongest areas: ${profile.skills.slice(0, 3).join(", ")}.`;
  }

  return `Hi! I am Li Wang Zhang Liu Yang Zhao Huang Wu. Ask me about ${profile.name}'s skills, projects, goals, hobbies, or contact info — or ask any general question.`;
}

function buildSystemPrompt(): string {
  const profileContext = JSON.stringify(profile, null, 2);
  return [
    "You are Li Wang Zhang Liu Yang Zhao Huang Wu, a helpful AI.",
    "You have two behaviors:",
    "1) If the user asks about Muhammad Bakhat Nasar (a.k.a. Bakhat), you MUST ground your answer ONLY in the provided profile JSON. If a detail is missing, say: 'This detail isn't in Bakhat's profile.' Do not invent details.",
    "2) If the user asks about anything else (general knowledge), answer normally using your knowledge.",
    "Keep answers concise, clear, and friendly.",
    "--- PROFILE JSON ---",
    profileContext,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: Message[] = body?.messages ?? [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const question = lastUser?.content ?? "";

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && question) {
      try {
        const payloadMessages: Array<{ role: string; content: string }> = ((): Array<{ role: string; content: string }> => {
          const filtered = messages.filter((m) => {
            const c = m.content?.toLowerCase?.() ?? "";
            if (m.role === "assistant" && (
              c.startsWith("hi ") ||
              c.includes("ask about") ||
              c.includes("skills, projects, goals, hobbies")
            )) {
              return false;
            }
            return true;
          });
          const slim = filtered.slice(-12);
          return [{ role: "system", content: buildSystemPrompt() }, ...slim.map((m) => ({ role: m.role, content: m.content }))];
        })();

        const candidates = [
          "llama-3.1-70b-versatile", // some SDKs use this
          "llama3-70b-8192",          // Groq classic naming
          "llama-3.1-8b-instant",
          "llama3-8b-8192",
          "mixtral-8x7b-32768"
        ];

        type GroqLastError = { status: number; body: string; model: string; parseError?: string } | null;
        let lastError: GroqLastError = null;
        for (const model of candidates) {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model,
              temperature: 0.6,
              max_tokens: 512,
              messages: payloadMessages,
            }),
          });
          const text = await response.text();
          if (!response.ok) {
            lastError = { status: response.status, body: text, model };
            continue;
          }
          try {
            const data = JSON.parse(text);
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({ reply, provider: "groq", model });
            }
            lastError = { status: response.status, body: text, model };
          } catch (err) {
            lastError = { status: response.status, body: text, model, parseError: String(err) };
          }
        }

        return NextResponse.json(
          { reply: `AI provider error. Tried ${candidates.length} models. Last error: ${JSON.stringify(lastError).slice(0, 500)}…`, provider: "error" },
          { status: 502 }
        );
      } catch (_e) {
        // Do not fall back to predefined answers when a key is present; surface an error so the user can fix it
        return NextResponse.json(
          { reply: "I couldn't reach the AI provider. Please verify GROQ_API_KEY and network connectivity.", provider: "error" },
          { status: 502 }
        );
      }
    }

    const answer = answerFromProfile(question);
    return NextResponse.json({ reply: answer, provider: "local" });
  } catch (_err) {
    return NextResponse.json({ reply: "Sorry, I couldn't process that.", provider: "local" }, { status: 200 });
  }
}


