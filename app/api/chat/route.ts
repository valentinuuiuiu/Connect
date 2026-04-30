import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: any, init?: ResponseInit) {
  return NextResponse.json(data, { ...init, headers: { ...corsHeaders, ...init?.headers } });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;
    // Accept both { messages: [...] } and { message: "text" } formats.
  const incomingMessages = messages ?? (body.message ? [{ role: "user", text: body.message }] : []);
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    return json({ error: "Invalid request format: expected 'messages' array or 'message' string" }, { status: 400 });
  }

    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api";
    if (!apiKey) {
      return json({ error: "API key missing" }, { status: 500 });
    }

    // Prompt: direct Romanian answer, no analysis.
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
 const mappedMessages = incomingMessages.map((m: any) => ({
 role: m.role === "model" ? "assistant" : m.role,
 content: m.content ?? m.text ?? "",
 }));

    const payload = {
      model: process.env.OPENAI_API_MODEL || "openai/gpt-4o-mini",
      messages: [{ role: "system", content: systemInstruction }, ...mappedMessages],
      temperature: 0.5,
    };

    let content = "";
    try {
      const endpoint = `${baseURL}/v1/chat/completions`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
 const errText = await response.text();
 throw new Error(`AI API ${response.status}: ${errText.slice(0, 500)}`);
      }
      const data = await response.json();
      content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.message?.reasoning_content ?? "";
      // Remove any analysis lines that may still be present.
      if (content) {
        const cleaned = content
          .split('\n')
          .filter(line => !/Analyze|Identify|Intent|Context|User (said|says|input)/i.test(line))
          .join('\n')
          .trim();
        content = cleaned || content;
      }
    } catch (aiErr: any) {
      console.error("AI request failed:", aiErr);
      return json({ error: aiErr.message || "AI service error" }, { status: 502 });
    }

    if (!content) {
      content = "Îmi pare rău, momentan nu pot genera un răspuns. Te rog să încerci din nou în câteva minute.";
    }
    return json({ content });
  } catch (e: any) {
    console.error("Chat API error:", e);
    return json({ error: e.message }, { status: 500 });
  }
}