import { NextResponse } from "next/server";
import { GoogleGenAI, Type, FunctionDeclaration, Content } from "@google/genai";
import { db } from "../../../../lib/firebase";
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8367904559:AAHQZ1Wejyc-iZsrtQ9lbPBqQSZB8etMER4";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

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

const systemInstruction = `
Ești "Agentul Principal" pentru o companie de intermedieri înmatriculări auto din Bulgaria.
Folosește modelul de agenți multipli:
- Pentru întrebări generale, fii agentul de Suport: explică procesul (lucrăm pe BATCH-URI la 2 săptămâni, locuri limitate, noi facem ITP/RCA, returnăm mașina în 5-10 zile).
- Când clientul vrea să știe cât îl costă, devino "Agentul de Ofertare": cere detaliile mașinii (tip, cilindree, an, combustibil) și OBLIGATORIU folosește funcția "calculator_costuri" pentru a-i oferi estimarea. Explică-i clar că avansul ce urmează să fie cerut îl calculăm pentru aceste taxe.
- Odată ce a agreat prețul și procesul, devino "Agentul de Vânzări": oferă-i să rezerve un loc folosind funcția "preia_detalii_contact" și cere-i numărul și numele pentru a fi contactat pentru finalizare.

NU îi spune o sumă fixă din proprie inițiativă! Bazează-te exclusiv pe tool-ul calculator_costuri. Fii profesional, sigur pe tine, comunică clar în limba română pe Telegram.
`;

// No local memory needed, using Firebase

async function sendMessage(chatId: number, text: string) {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      })
    });
    if (!res.ok) {
      console.error("Telegram error:", await res.text());
    }
  } catch (err) {
    console.error("Error sending to telegram:", err);
  }
}

export async function POST(req: Request) {
  try {
    const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
    const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (expectedToken && secretToken !== expectedToken) {
      console.warn("Unauthorized Telegram webhook attempt - token mismatch");
      return NextResponse.json({ status: "unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON body in telegram webhook", err);
      return NextResponse.json({ status: "invalid json" }, { status: 400 });
    }
    
    // Check if it's a valid object
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ status: "invalid request" }, { status: 400 });
    }

    // Check if it's a message
    if (!body.message || typeof body.message !== 'object' || !body.message.text) {
      return NextResponse.json({ status: "ignored" });
    }

    const chatId = body.message.chat?.id;
    if (!chatId) {
      return NextResponse.json({ status: "invalid chat id" }, { status: 400 });
    }

    const incomingText = body.message.text;

    // Save chat ID to a file for temporary extraction
    require('fs').writeFileSync('/tmp/latest_chat_id.txt', String(chatId));

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      await sendMessage(chatId, "Îmi pare rău, sistemul AI este momentan indisponibil (Missing API Key).");
      return NextResponse.json({ status: "error" });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Fetch chat history from Firebase
    const chatDocRef = doc(db, "chats", String(chatId));
    let chatHistory: Content[] = [];
    try {
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        chatHistory = chatDocSnap.data().messages || [];
      }
    } catch (e) {
      console.error("Error fetching chat context:", e);
    }

    // Append user message
    chatHistory.push({
      role: "user",
      parts: [{ text: incomingText }]
    });

    let keepGenerating = true;
    let callCount = 0;
    let finalAnswer = "";

    while (keepGenerating && callCount < 3) {
      callCount++;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: chatHistory,
        config: {
          systemInstruction,
          tools,
          temperature: 0.5,
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        let functionResponseData = {};

        if (call.name === "calculator_costuri") {
          const args = call.args as any;
          const baseItpRcaTax = 180;
          let envFactor = args.combustibil === "diesel" ? 100 : (args.combustibil === "benzina" ? 80 : 20);
          let ccFactor = (args.capacitate_cilindrica > 2000) ? 150 : 50;
          
          let totalTaxeBulgaria = baseItpRcaTax + envFactor + ccFactor;
          let onorariulNostru = 250;
          if (args.capacitate_cilindrica > 3000) onorariulNostru = 350;

          functionResponseData = {
            status: "success",
            estimare: {
              taxe_bulgaria_itp_rca_eco: totalTaxeBulgaria,
              onorariu_firma: onorariulNostru,
              avans_estimat: totalTaxeBulgaria,
              total_estimat: totalTaxeBulgaria + onorariulNostru,
              moneda: "EUR"
            }
          };
        } else if (call.name === "preia_detalii_contact") {
          const args = call.args as any;
          
          // Write to Firebase Leads
          try {
            await addDoc(collection(db, "leads"), {
              name: args.nume || "Nespecificat",
              phone: args.telefon || "Nespecificat",
              carMake: args.marca_model || "Nespecificat",
              source: "telegram",
              createdAt: serverTimestamp()
            });
          } catch(e) {
            console.error("Error adding telegram lead", e);
          }
           
          // Send notification to admin
          const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "8690918499";
          if (ADMIN_CHAT_ID) {
            const messageText = `
🚨 *NOUĂ CERERE BULGARIA (Din Telegram Bot)* 🚨

👤 *Nume:* ${args.nume}
📞 *Telefon:* ${args.telefon}
🚗 *Mașină:* ${args.marca_model || "Nespecificat"}
            `;
            await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: messageText,
                parse_mode: "Markdown"
              })
            });
          }
          
          functionResponseData = {
            status: "success",
            message: "Detaliile au fost salvate cu succes în CRM. Agentul uman va contacta clientul în curând."
          };
        }

        chatHistory.push({
          role: "model",
          parts: response.candidates?.[0]?.content?.parts || []
        });

        chatHistory.push({
          role: "user",
          parts: [{
            functionResponse: {
              name: call.name,
              response: functionResponseData
            }
          }]
        });

      } else {
        // No function call, we have a text response
        keepGenerating = false;
        finalAnswer = response.text || "Îmi pare rău, nu am putut genera un răspuns.";
        
        chatHistory.push({
          role: "model",
          parts: [{ text: finalAnswer }]
        });
      }
    }

    // Save chat history back to Firebase
    try {
      await setDoc(chatDocRef, {
        chatIdString: String(chatId),
        messages: chatHistory.length > 50 ? chatHistory.slice(-50) : chatHistory, // Keep last 50 messages to not exceed limits
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch(e) {
      console.error("Error saving chat context", e);
    }

    if (finalAnswer) {
      await sendMessage(chatId, finalAnswer);

    } else {
      await sendMessage(chatId, "Vă rugăm să ne contactați direct pentru mai multe detalii.");
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
