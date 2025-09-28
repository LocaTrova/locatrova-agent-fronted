import { useMemo, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router";
import Navbar from "@/components/home/Navbar";
import RotatingWord from "@/components/shared/RotatingWord";

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

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);
    },
    [],
  );

  const handleSearch = useCallback(() => {
    navigate(`/chat?q=${encodeURIComponent(prompt)}`);
  }, [navigate, prompt]);

  const handleIdeaClick = useCallback(
    (idea: string) => () => {
      setPrompt(idea);
    },
    [],
  );

  return (
    <section
      tabIndex={-1}
      aria-label="main content"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#FFFCF5" }}
    >
      <Navbar />
      {/* Background gradient layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(312deg, rgb(160,165,194) 27.0662%, rgb(206,221,228) 100%)",
          }}
        />
        {/* Hero background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://static.wixstatic.com/media/343a2a_5c066484f7904623adfe3ee51e4634a8~mv2.jpg/v1/fill/w_2880,h_1527,al_c,q_90,enc_avif,quality_auto/Hero-bg-base-new.jpg"
            alt="Hero background"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
              maskPosition: "50% 50%",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-[3840px] flex-col px-4 sm:px-6 lg:px-8 pt-24 sm:pt-40 lg:pt-56 pb-16 sm:pb-24 lg:pb-36">
        <div className="mx-auto w-full max-w-[2400px] text-center">
          <h1 className="mx-auto max-w-[92%] sm:max-w-[80%] lg:max-w-[60%] text-center font-['Wix Madefor Text'] text-[clamp(28px,7vw,72px)] leading-tight tracking-[-0.01em] text-slate-900">
            Trova la <span className="text-brand">location</span> perfetta per
            il tuo{" "}
            <RotatingWord
              words={["evento", "esperienza", "shooting", "spot", "progetto"]}
              interval={1800}
            />
            .
          </h1>
          <p className="mx-auto mt-6 sm:mt-8 lg:mt-10 max-w-[92%] sm:max-w-[70%] lg:max-w-[41%] text-center font-['Wix Madefor Text'] text-[clamp(16px,3.6vw,22px)] leading-relaxed text-slate-800">
            Scrivi ciò che ti serve o lasciati ispirare: Locatrova cura per te i
            risultati migliori.
          </p>
        </div>

        {/* Input card */}
        <div className="mx-auto mt-10 sm:mt-16 lg:mt-24 w-full max-w-xl sm:max-w-2xl lg:max-w-[2106px] rounded-2xl sm:rounded-[50px] lg:rounded-[70px] border border-slate-300/60 bg-white/80 p-4 sm:p-6 lg:p-9 backdrop-blur-[20px]">
          <div className="relative">
            <label htmlFor="idea-input" className="sr-only">
              Describe the location you want to scout
            </label>
            <textarea
              id="idea-input"
              rows={6}
              placeholder="Describe the scene or location you want to scout..."
              value={prompt}
              onChange={handlePromptChange}
              className="min-h-28 sm:min-h-40 lg:min-h-[220px] w-full resize-none rounded-[24px] sm:rounded-[40px] lg:rounded-[61px] border border-slate-300 px-6 sm:px-10 lg:px-14 py-6 sm:py-10 lg:py-12 text-[clamp(14px,2.6vw,18px)] leading-relaxed text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              aria-label="Search locations"
              title="Search locations"
              disabled={disabled}
              onClick={handleSearch}
              className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-brand text-black ui-focus disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-8">
            <p className="mb-3 sm:mb-4 text-[clamp(14px,2.8vw,18px)] leading-relaxed text-slate-700">
              Non sai da dove iniziare? Prova uno di questi spunti:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              {ideas.map((label) => (
                <button
                  key={label}
                  onClick={handleIdeaClick(label)}
                  className="rounded-full border border-slate-400/70 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-[clamp(12px,2.6vw,18px)] text-slate-700 hover:bg-slate-50 ui-focus"
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="mx-auto mt-10 sm:mt-16 lg:mt-24 flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 px-4">
          <div className="flex items-center -space-x-3">
            <img
              src="https://static.wixstatic.com/media/343a2a_e11a5a44bfae4bc583f904ff2c77705d~mv2.jpg"
              alt="User avatar 1"
              className="h-8 w-8 rounded-full border-2 border-white shadow"
            />
            <img
              src="https://static.wixstatic.com/media/343a2a_47eb1180497b403c82b3a7d7e4bae400~mv2.jpg"
              alt="User avatar 2"
              className="h-8 w-8 rounded-full border-2 border-white shadow"
            />
            <img
              src="https://static.wixstatic.com/media/343a2a_4f1e05bea2af49c681922503d71736c4~mv2.jpg"
              alt="User avatar 3"
              className="h-8 w-8 rounded-full border-2 border-white shadow"
            />
          </div>
          <p className="text-sm text-slate-800">
            Scelto da oltre 400K professionisti
          </p>
        </div>
      </div>
    </section>
  );
}
