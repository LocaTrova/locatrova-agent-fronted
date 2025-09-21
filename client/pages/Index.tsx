import { useMemo, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const disabled = prompt.trim().length === 0;
  const navigate = useNavigate();

  const ideas = useMemo(
    () => [
      "Reporting Dashboard",
      "Gaming Platform",
      "Onboarding Portal",
      "Networking App",
      "Room Visualizer",
    ],
    [],
  );

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

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
      className="relative min-h-[2031px] w-full overflow-hidden"
      style={{ backgroundColor: "rgba(255,255,0,1)" }}
    >
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
            style={{ maskSize: "100% 100%", maskRepeat: "no-repeat", maskPosition: "50% 50%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-[3840px] flex-col px-6 pt-[355px] pb-[153px]">
        <div className="mx-auto w-full max-w-[2400px] text-center">
          <h1 className="mx-auto max-w-[60%] text-center font-[\'Wix Madefor Text\'] text-[152px] leading-[1.1] tracking-[-0.01em] text-slate-900">
            <span>Let’s make your dream a </span>
            <span className="text-[152px] text-[rgb(235,255,177)]">reality. </span>
            <span>Right now.</span>
          </h1>
          <p className="mx-auto mt-14 max-w-[41%] text-center font-[\'Wix Madefor Text\'] text-[44px] leading-[1.4] text-slate-800">
            Base44 lets you build fully-functional apps in minutes with just your words. No coding necessary.
          </p>
        </div>

        {/* Input card */}
        <div className="mx-auto mt-24 w-full max-w-[2106px] rounded-[70px] border border-slate-300/60 bg-white/80 p-9 backdrop-blur-[20px]">
          <div className="relative">
            <label htmlFor="idea-input" className="sr-only">
              What do you want to build?
            </label>
            <textarea
              id="idea-input"
              rows={6}
              placeholder="What do you want to build?"
              value={prompt}
              onChange={handlePromptChange}
              className="min-h-[220px] w-full resize-none rounded-[61px] border border-slate-300 px-14 py-12 text-[36px] leading-[1.4] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              aria-label="Start Now"
              title="Start Now"
              disabled={disabled}
              onClick={handleSearch}
              className="absolute right-8 bottom-8 flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(255,152,59)] text-black ui-focus disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-8">
            <p className="mb-4 text-[32px] leading-[38px] text-slate-700">
              Not sure where to start? Try one of these:
            </p>
            <div className="flex flex-wrap items-center justify-around gap-5">
              {ideas.map((label) => (
                <button
                  key={label}
                  onClick={handleIdeaClick(label)}
                  className="rounded-full border border-slate-400/70 px-8 py-4 text-[28px] text-slate-700 hover:bg-slate-50 ui-focus"
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="mx-auto mt-24 flex items-center gap-6">
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
          <p className="text-sm text-slate-800">Trusted by 400K+ users</p>
        </div>
      </div>
    </section>
  );
}
