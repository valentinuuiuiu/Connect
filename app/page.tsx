import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { BatchSystem } from "@/components/BatchSystem";
import { Pricing } from "@/components/Pricing";
import { LeadForm } from "@/components/LeadForm";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-emerald-500/30">
      <Navbar />
      <Hero />
      <HowItWorks />
      <BatchSystem />
      <Testimonials />
      <Pricing />
      <LeadForm />
      <Footer />
      <Chatbot />
    </main>
  );
}
