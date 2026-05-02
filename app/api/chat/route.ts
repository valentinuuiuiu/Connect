import { GoogleGenAI, Type, FunctionDeclaration, Content } from "@google/genai";
import { NextResponse } from "next/server";

const calculatorCosturi: FunctionDeclaration = {
  name: "calculator_costuri",
  description: "Calculează o estimare a cheltuielilor totale și a avansului pentru înmatricularea unei mașini în Bulgaria.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tip_vehicul: { type: Type.STRING, description: "Turism, suv, duba sau altele" },
      capacitate_cilindrica: { type: Type.NUMBER, description: "Capacitatea cilindrică (cmc)" },
      combustibil: { type: Type.STRING, description: "Diesel, benzina, hibrid, electric" },
      an_fabricatie: { type: Type.NUMBER, description: "Anul fabricației" }
    },
    required: ["tip_vehicul", "capacitate_cilindrica", "combustibil", "an_fabricatie"]
  }
};

const preiaDetaliiContact: FunctionDeclaration = {
  name: "preia_detalii_contact",
  description: "Colectează datele de contact ale utilizatorului pentru a fi preluat de un agent uman (dacă utilizatorul dorește să rezerve).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      nume: { type: Type.STRING, description: "Numele clientului" },
      telefon: { type: Type.STRING, description: "Numărul de telefon" },
      marca_model: { type: Type.STRING, description: "Marca și modelul mașinii" }
    },
    required: ["nume", "telefon"]
  }
};

const tools = [{ functionDeclarations: [calculatorCosturi, preiaDetaliiContact] }];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Ești "Agentul Principal" pentru o companie de intermedieri înmatriculări auto din Bulgaria.
Folosește modelul de agenți multipli:
- Pentru întrebări generale, fii agentul de Suport: explică procesul (lucrăm pe BATCH-URI la 2 săptămâni, locuri limitate, noi facem ITP/RCA, returnăm mașina în 5-10 zile).
- Când clientul vrea să știe cât îl costă, devino "Agentul de Ofertare": cere detaliile mașinii (tip, cilindree, an, combustibil) și OBLIGATORIU folosește funcția "calculator_costuri" pentru a-i oferi estimarea (nu inventa!). Odată obținut rezultatul, comunică-i costul ITP/RCA/alte taxe (date de funcție) + onorariul nostru. Explică-i clar că avansul ce urmează să fie cerut îl calculăm pentru aceste taxe.
- Odată ce a agreat prețul și procesul, devino "Agentul de Vânzări": oferă-i să rezerve un loc folosind funcția "preia_detalii_contact" și cere-i numărul și numele pentru a fi contactat pentru finalizare.

NU îi spune o sumă fixă din proprie inițiativă! Bazează-te exclusiv pe tool-ul calculator_costuri. Fii profesional, sigur pe tine, comunică clar în limba română.
`;

    // Map messages
    const geminiMessages: Content[] = messages.map((m: any) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    // Start Chat
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction,
        tools,
        temperature: 0.5,
      }
    });

    // Populate history (if we need to restore state)
    // Wait, ai.chats.create takes history directly? Not in all SDK versions. 
    // We can just use generateContent iteratively here.

    let currentMessages = [...geminiMessages];
    
    // We execute function calling in a controlled loop (up to 3 times)
    let callCount = 0;
    while (callCount < 3) {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: currentMessages,
        config: {
          systemInstruction,
          tools,
          temperature: 0.5,
        }
      });
      
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        // We received function call(s)
        const call = functionCalls[0];
        
        let functionResponseData = {};
        
        if (call.name === "calculator_costuri") {
          const args = call.args as any;
          // Dummy calculation logic based on inputs
          const baseItpRcaTax = 180;
          let envFactor = args.combustibil === "diesel" ? 100 : (args.combustibil === "benzina" ? 80 : 20);
          let ccFactor = (args.capacitate_cilindrica > 2000) ? 150 : 50;
          
          let totalTaxeBulgaria = baseItpRcaTax + envFactor + ccFactor;
          let onorariulNostru = 250; // default fee
          if (args.capacitate_cilindrica > 3000) onorariulNostru = 350;

          functionResponseData = {
            status: "success",
            estimare: {
              taxe_bulgaria_itp_rca_eco: totalTaxeBulgaria,
              onorariu_firma: onorariulNostru,
              avans_estimat: totalTaxeBulgaria, // avans covers their taxes
              total_estimat: totalTaxeBulgaria + onorariulNostru,
              moneda: "EUR"
            }
          };
        } else if (call.name === "preia_detalii_contact") {
          functionResponseData = {
            status: "success",
            message: "Detaliile au fost salvate. Spune-i clientului că va fi contactat în foarte scurt timp."
          };
        }

        // Add the model's fn call part
        currentMessages.push({
          role: "model",
          parts: response.candidates?.[0]?.content?.parts || []
        } as Content);

        // Add the tool response part
        currentMessages.push({
          role: "user",
          parts: [{
            functionResponse: {
              name: call.name,
              response: functionResponseData
            }
          }]
        } as Content);
        
        callCount++;
      } else {
        // No function calls, we have the final text response.
        // Let's stream it to client just by chunking the text (to mimic stream)
        const text = response.text || "";
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // Fake stream
            const chunkSize = 20;
            let i = 0;
            function push() {
              if (i < text.length) {
                controller.enqueue(encoder.encode(text.substring(i, i + chunkSize)));
                i += chunkSize;
                setTimeout(push, 20);
              } else {
                controller.close();
              }
            }
            push();
          }
        });

        return new Response(stream, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }

    return NextResponse.json({ error: "Prea multe apeluri de funcții înlănțuite." }, { status: 500 });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
