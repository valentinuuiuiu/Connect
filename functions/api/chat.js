// Cloudflare Pages Function - /api/chat
// Path: /root/app/functions/api/chat.js

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await request.json();
    const { messages } = body;
    const incomingMessages = messages ?? (body.message ? [{ role: "user", text: body.message }] : []);
    
    if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request format: expected 'messages' array or 'message' string" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = env.OPENAI_API_KEY;
    const baseURL = env.OPENAI_BASE_URL || "https://openrouter.ai/api";
    const apiModel = env.OPENAI_API_MODEL || "openai/gpt-4o-mini";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

 const systemInstruction = `Ești Asistentul Virtual AutoConnect — consultant expert în înmatriculare auto în Bulgaria pentru clienți din România.

=== SERVICII ȘI PREȚURI ===

Pachetul Basic (900–1100€):
• Procesarea completă a actelor în Bulgaria
• Traduceri autorizate + taxe notar
• Taxe autorități BG incluse
• RCA Bulgaria pe 1 lună inclus
• ITP Bulgaria (valabil în RO) inclus
• NU include transport — clientul aduce personal mașina în Ruse

Pachetul Standard (1100–1300€) — CEL MAI POPULAR:
• Tot ce include Basic
• Transport pe platformă dus-întors de la domiciliul clientului
• Asigurare pe durata transportului
• Ridicare mașină de la domiciliu + returnare cu acte gata

Pachetul Full Service (1300–1500€):
• Tot ce include Standard
• Prioritate maximă în lotul curent (loc garantat)
• RCA Bulgaria pe 3 luni inclus
• Serviciu de reprezentare daune valabil
• Consultanță VIP dedicată

=== DETALII ESENȚIALE ===
• Durata totală: 5–10 zile lucrătoare de la preluare
• Sistem de loturi: grupăm 3–10 mașini per transport = costuri minime
• Maxim 10 locuri per lot, avans 600€ pentru rezervare
• Servicii B2B (flote) și B2C (persoane fizice)
• 100% legal, fără taxe ascunse la fața locului
• Prețul confirmat rămâne fix — zero surprize

=== REGULI STRICTE DE RĂSPUNS ===
1. RĂSPUNDE DOAR ÎN LIMBA ROMÂNĂ, direct și concis (2-4 propoziții maxim).
2. Identifică-te ca Asistentul AutoConnect dacă ești întrebat cine ești.
3. NU incluce niciodată: analize, reasoning, metadate, gânduri interne, tag-uri, JSON, sau prefixe precum "Assistant:".
4. Când compară pachete, folosește bullet points scurte.
5. Dacă nu știi un detaliu exact → recomandă formularul de contact pentru ofertă personalizată.
6. Dacă utilizatorul e interesat de rezervare → menționează avansul de 600€ și butonul "Rezervă Loc".
7. Pentru întrebări off-topic → redirecționează politicos spre serviciile AutoConnect.`;

    const mappedMessages = incomingMessages.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text,
    }));

    const payload = {
      model: apiModel,
      messages: [{ role: "system", content: systemInstruction }, ...mappedMessages],
      temperature: 0.3,
    };

    const response = await fetch(`${baseURL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://inmatriculari.piata-ai.ro/",
        "X-Title": "AutoConnect Chat"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: "AI service error: " + errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content ?? "";
    
 // Final cleanup — remove any reasoning/analysis leakage from models
 if (content) {
 content = content
 .replace(/^Assistant:\s*/i, "")
 .split('\n')
 .filter(line => !/^(Analyze|Identify|Intent|Context|User (said|says|input)|Reasoning|Thinking|Step \d)/i.test(line.trim()))
 .join('\n')
 .trim();
 }

    if (!content) {
      content = "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să reîncerci sau să ne contactezi prin formular.";
    }

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions({ request, env }) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") return onRequestOptions({ request, env });
  if (request.method === "POST") return onRequestPost({ request, env });
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  });
}