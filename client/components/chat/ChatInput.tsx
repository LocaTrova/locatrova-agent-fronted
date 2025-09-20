import { ArrowUp, Plus, Palette } from "lucide-react";
import React, { useCallback, useState } from "react";

export default function ChatInput({
  placeholder = "Describe the scene or location you want to scout...",
  onSend,
  autoFocus,
}: {
  placeholder?: string;
  onSend: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const disabled = value.trim().length === 0;

  const handleSend = useCallback(() => {
    if (disabled) return;
    onSend(value.trim());
    setValue("");
  }, [disabled, onSend, value]);

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.key === "Enter" && (e.metaKey || e.ctrlKey)) || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-full backdrop-blur bg-white border border-slate-200 rounded-2xl sm:rounded-[30px] shadow-[0_0_0_0_rgba(0,0,0,0),0_8px_16px_0_rgba(0,0,0,0.04)] px-2">
      <div className="relative">
        <label htmlFor="chat-input" className="sr-only">
          {placeholder}
        </label>
        <textarea
          id="chat-input"
          placeholder={placeholder}
          className="mt-2 h-[120px] max-h-[240px] min-h-[110px] w-full resize-none rounded-2xl pl-6 pr-16 pt-3 text-base/6 font-light text-slate-800 placeholder:text-slate-400 focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
        />
        <button
          aria-label="Send message"
          title="Send message"
          disabled={disabled}
          onClick={handleSend}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition ui-focus disabled:cursor-not-allowed disabled:opacity-70"
          style={{ transform: "rotate(90deg)" }}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.txt,.html" className="hidden" />
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-black hover:bg-slate-50 ui-focus" aria-label="Add attachment">
            <Plus className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 ui-focus" aria-label="Styling instructions">
            <Palette className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-500">Styling Instructions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
