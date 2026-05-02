import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8367904559:AAHQZ1Wejyc-iZsrtQ9lbPBqQSZB8etMER4";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "8690918499";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Write lead to Firebase
    try {
      await addDoc(collection(db, "leads"), {
        name: data.nume || "",
        phone: data.telefon || "",
        email: data.email || "",
        carMake: data.marca || "",
        carYear: data.an || "",
        city: data.oras || "",
        urgency: data.urgency || "",
        source: "web",
        createdAt: serverTimestamp()
      });
    } catch (firebaseError) {
      console.error("Firebase lead write error:", firebaseError);
      // We continue to send the telegram message even if firebase fails
    }
    
    // We only send the message if there's an admin chat ID configured
    if (!ADMIN_CHAT_ID) {
      console.warn("No ADMIN_CHAT_ID configured. Lead received but not forwarded to Telegram.");
      return NextResponse.json({ status: "success", warning: "No admin chat ID configured" });
    }

    const messageText = `
🚨 *NOUĂ CERERE BULGARIA* 🚨

👤 *Nume/Contact:* ${data.nume}
📞 *Telefon:* ${data.telefon}
✉️ *Email:* ${data.email}
🚗 *Mașină:* ${data.marca} (An: ${data.an})
📍 *Locație:* ${data.oras}
⏱️ *Urgență:* ${data.urgency === 'rapid' ? '🚀 Super Rapid' : '🟢 Normal'}
    `;

    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: messageText,
        parse_mode: "Markdown"
      })
    });

    if (!res.ok) {
        console.error("Failed to send telegram msg:", await res.text());
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
