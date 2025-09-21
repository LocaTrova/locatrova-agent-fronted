import { useMemo, useState, useCallback } from "react";
import { ArrowUp, Palette, Plus, Lightbulb } from "lucide-react";
import AppCard from "@/components/home/AppCard";
import { useNavigate } from "react-router";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const disabled = prompt.trim().length === 0;
  const navigate = useNavigate();

  const ideas = useMemo(
    () => [
      "Urban exteriors",
      "Natural landscapes",
      "Industrial sites",
      "Residential interiors",
      "Iconic landmarks",
    ],
    [],
  );

  // Memoize the onChange handler to prevent re-creation on every render
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

  // Memoize the onClick handler to prevent re-creation on every render
  const handleSearch = useCallback(() => {
    navigate(`/chat?q=${encodeURIComponent(prompt)}`);
  }, [navigate, prompt]);

  return (
    <div className="min-h-screen flex-1 overflow-x-auto bg-slate-50">
      <main className="w-full h-full">
        <div>
          <main className="relative z-10 mx-auto max-w-screen-2xl px-8 pb-12">
            <div className="relative mb-16 px-4 sm:px-6 text-center mt-20 sm:mt-24 md:mt-[110px]">
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <h1 className="mb-2 text-4xl sm:text-5xl md:text-6xl leading-[44px] sm:leading-[60px] md:leading-[72px] font-medium text-slate-800">
                  Locatrova: What location do you need today?
                </h1>
                <p className="text-slate-600 text-lg leading-7 font-light">
                  Describe your shoot brief or location requirements below — or
                  get inspired by our suggestions.
                </p>
              </div>

              <div className="mx-auto max-w-3xl px-2 sm:px-0">
                <div className="relative">
                  <div className="relative w-full backdrop-blur bg-white border border-slate-200 rounded-2xl sm:rounded-[30px] shadow-[0_0_0_0_rgba(0,0,0,0),0_8px_16px_0_rgba(0,0,0,0.04)] px-2">
                    <div className="relative">
                      <label htmlFor="idea-input" className="sr-only">
                        Describe the app you want to create
                      </label>
                      <textarea
                        id="idea-input"
                        placeholder="Describe the scene or location you want to scout..."
                        className="mt-2 h-[120px] max-h-[200px] min-h-[110px] w-full resize-none rounded-2xl pl-6 pr-16 pt-3 text-base/6 font-light text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        value={prompt}
                        onChange={handlePromptChange}
                      />
                      <button
                        aria-label="Search locations"
                        title="Search locations"
                        disabled={disabled}
                        onClick={handleSearch}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition ui-focus disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ transform: "rotate(90deg)" }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.txt,.html"
                      className="hidden"
                    />
                    <div className="flex items-center justify-between px-4 py-4 text-sm">
                      <div className="flex items-center gap-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-black hover:bg-slate-50 ui-focus">
                            <Plus className="h-4 w-4" />
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 ui-focus">
                            <Palette className="h-4 w-4 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              Styling Instructions
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-full px-2">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-light text-slate-700">
                      Location ideas to get started
                    </h3>
                    <a
                      href="/apps"
                      className="inline-flex items-center gap-1 rounded-xl bg-[rgba(255,172,105,0.15)] px-3 py-1.5 text-sm font-light text-[hsl(var(--accent-foreground))] hover:opacity-90 ui-focus"
                    >
                      <Lightbulb className="h-3.5 w-3.5 text-[hsl(var(--accent-foreground))]" />
                      More ideas
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ideas.map((label) => (
                      <button key={label} className="ui-chip ui-focus">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl md:rounded-[30px] bg-white px-4 sm:px-6 md:px-8 py-6 md:py-8 shadow-[0_0_0_0_rgba(0,0,0,0),0_5px_10px_0_rgba(35,107,215,0.05)] motion-safe:animate-fade-in">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 -top-40 -z-10 h-[800px] w-[2215px] max-h-[600px] -translate-x-1/2 rounded-[2215px]"
                style={{
                  backgroundImage:
                    "radial-gradient(50% 50%, rgb(255, 85, 0) 0%, rgb(255, 234, 166) 100%)",
                  filter: "blur(153.4px)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 -z-10 h-[1348px] w-[2215px] max-h-[600px] -translate-x-1/2 rounded-[2215px]"
                style={{
                  backgroundImage:
                    "radial-gradient(50% 50%, rgb(255, 85, 0) 0%, rgb(255, 234, 166) 100%)",
                  filter: "blur(153.4px)",
                }}
              />

              <div className="motion-safe:animate-fade-in">
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative">
                    <h2 className="text-xl font-bold text-slate-900">
                      Recent Projects
                    </h2>
                  </div>
                  <a
                    href="/apps"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 ui-focus"
                  >
                    View all
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      href: "https://app.base44.com/apps/68b9b8afe044bcbff7748a5b/editor/preview",
                    },
                    {
                      href: "https://app.base44.com/apps/68b9b8ae3baa04995f233086/editor/preview",
                    },
                    {
                      href: "https://app.base44.com/apps/68b9b8ae61e2317857a8f354/editor/preview",
                    },
                    {
                      href: "https://app.base44.com/apps/68b9b8aa2d451e26fad5a5e5/editor/preview",
                    },
                    {
                      href: "https://app.base44.com/apps/68b9b82f2d451e26fad5a57e/editor/preview",
                    },
                    {
                      href: "https://app.base44.com/apps/68b9b82f2aa5b96bbb4166da/editor/preview",
                    },
                  ].map((app, idx) => (
                    <AppCard
                      key={app.href}
                      href={app.href}
                      title="untitled"
                      description="No notes yet"
                      containerStyle={{ animationDelay: `${idx * 0.08}s` }}
                    />
                  ))}

                  <AppCard
                    href="https://app.base44.com/apps/68b992a60246ed249647fb64/editor/preview"
                    title="WanderWise"
                    description="Sunlit coastal town backdrop with walkable streets and boutique fronts."
                    logoUrl="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b992a60246ed249647fb64/30ee56946_logo.png"
                    logoAlt="WanderWise Logo"
                    updatedText="Updated 15 days ago"
                    containerStyle={{ animationDelay: `${6 * 0.08}s` }}
                  />

                  <AppCard
                    href="https://app.base44.com/apps/68b96ebee640fb4df249d447/editor/preview"
                    title="WelcomePath"
                    description="Warm office lobby with natural wood, neutral palette, and soft lighting."
                    logoUrl="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b96ebee640fb4df249d447/ba83123f8_logo.png"
                    logoAlt="WelcomePath Logo"
                    updatedText="Updated 15 days ago"
                    containerStyle={{ animationDelay: `${7 * 0.08}s` }}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
