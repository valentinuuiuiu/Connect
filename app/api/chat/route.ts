import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing. Ensure OPENAI_API_KEY is set." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL, // Optional compatible base URL
    });

    const systemInstruction = `
Ești un asistent AI de vânzări și suport pentru o companie românească ce intermediază înmatriculări auto în Bulgaria.

Rolul tău:
1. Să răspunzi clar și scurt la întrebările despre proces.
2. Să explici modelul nostru de operare: lucrăm pe BATCH-URI (loturi) de 3-10 mașini pentru a reduce costurile și timpul.
3. Să creezi un sentiment de urgență politicos: locurile într-un batch sunt limitate.
4. Să împingi utilizatorul să lase datele în formularul de pe site și să rezerve un loc.
5. După ce utilizatorul își exprimă interesul de a rezerva un loc, solicită-i să confirme avansul de 600€. Explică-i scurt că acest avans acoperă o parte din costurile operaționale și taxele inițiale, restul urmând să fie achitat la finalizare. Îndrumă-l să folosească formularul principal de pe pagină pentru a finaliza plata securizată prin Stripe (care emite automat și factură).

Procesul pe scurt (în caz că te întreabă):
- Trimit datele mașinii (prin formularul de pe site).
- Achită avansul fix de 600€ prin Stripe pentru confirmare și emitere factură.
- Noi transportăm lotul spre Bulgaria.
- Acolo facem ITP, RCA și acte.
- Returnăm mașina gata de drum în 5-10 zile, moment în care se achită restul sumei.

Ton: Profesional, săritor, sigur pe el (corporate trust), "to the point", comunicare în limba română. Fii concis, fără paragrafe lungi.
`;

    // Map the internal `{ role: "user" | "model", text: string }` format to OpenAI's `{ role: "user" | "assistant", content: string }`
    const mappedMessages = messages.map((m: any) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text
    }));

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || "gpt-4o-mini", // Fallback model
      messages: [
        { role: "system", content: systemInstruction },
        ...mappedMessages
      ],
      temperature: 0.5,
      stream: true,
    });
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
