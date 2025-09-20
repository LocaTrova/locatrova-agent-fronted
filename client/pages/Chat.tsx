import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import MessageBubble, { Message } from "@/components/chat/MessageBubble";
import ResultCard from "@/components/chat/ResultCard";

export default function ChatPage() {
  const [params] = useSearchParams();
  const seed = params.get("q")?.trim();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const initial: Message[] = [];
    if (seed) {
      initial.push({ id: crypto.randomUUID(), role: "user", content: seed });
      initial.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Great brief. I’ll suggest a few options and refine as we chat.",
      });
    } else {
      initial.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Describe the scene you need (e.g., ‘sunlit loft with brick walls’) and I’ll curate locations.",
      });
    }
    setMessages(initial);
  }, [seed]);

  const results = useMemo(
    () => [
      {
        title: "Rooftop Terrace – City Skyline",
        description: "Golden-hour friendly rooftop with clear skyline view and elevator access.",
        imageUrl:
          "https://images.unsplash.com/photo-1523759711518-c4a2b5a8e7d3?q=80&w=400&auto=format&fit=crop",
        badge: "sunset",
      },
      {
        title: "Industrial Warehouse",
        description: "Raw textures, high ceilings, east-facing windows; controllable light.",
        imageUrl:
          "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=400&auto=format&fit=crop",
        badge: "moody",
      },
      {
        title: "Modern Office Lobby",
        description: "Neutral palette, natural wood, large glass facade, great for corporate scenes.",
        imageUrl:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
        badge: "corporate",
      },
    ],
    [],
  );

  const onSend = (content: string) => {
    const user: Message = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, user]);
    // Placeholder assistant response
    const assistant: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Got it. Refining matches based on your brief.",
    };
    setTimeout(() => setMessages((prev) => [...prev, assistant]), 400);
  };

  return (
    <div className="h-[100svh] w-full overflow-hidden bg-slate-50">
      <div className="mx-auto max-w-screen-2xl h-full px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Left: Chat */}
          <section className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white">
            <div aria-live="polite" className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-2 [scrollbar-gutter:stable] pb-24 lg:pb-2 flex flex-col space-y-3 sm:space-y-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 p-2 sm:p-3 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 pb-safe">
              <ChatInput onSend={onSend} autoFocus />
            </div>
          </section>

          {/* Right: Curated results */}
          <section className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <h2 className="text-sm font-semibold text-slate-900">Curated results</h2>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 [scrollbar-gutter:stable]">
              {results.map((r, i) => (
                <ResultCard key={i} {...r} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
