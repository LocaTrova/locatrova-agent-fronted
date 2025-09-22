import React, { useCallback, useState } from "react";
import { ArrowUp, Plus, Palette } from "lucide-react";
import { DIMENSIONS, MESSAGES, UI_TEXT, FILE_CONFIG } from "../../constants";
import { STYLES } from "../../constants/styles";

interface SearchInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  showAttachment?: boolean;
  showStyling?: boolean;
  className?: string;
}

/**
 * Reusable search/chat input component
 * Follows Single Responsibility Principle - Only handles input and submission
 */
export default function SearchInput({
  placeholder = MESSAGES.PLACEHOLDERS.SEARCH_DEFAULT,
  onSubmit,
  showAttachment = true,
  showStyling = true,
  className = "",
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const isDisabled = value.trim().length === 0;

  const handleSubmit = useCallback(() => {
    if (isDisabled) return;
    onSubmit(value.trim());
    setValue("");
  }, [isDisabled, onSubmit, value]);

  // Memoize the onChange handler to prevent re-creation on every render
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  // Memoize the file input click handler to prevent re-creation on every render
  const handleAttachmentClick = useCallback(() => {
    document.getElementById("file-input")?.click();
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    if (
      (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ||
      (e.key === "Enter" && !e.shiftKey)
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // File handling logic can be extended here
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files);
    }
  };

  const textareaStyle = STYLES.INPUT.TEXTAREA;

  return (
    <div className={`${STYLES.CONTAINER.INPUT_WRAPPER} ${className} ring-1 ring-orange-300/20`}>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          {placeholder}
        </label>
        <textarea
          id="search-input"
          placeholder={placeholder}
          className={textareaStyle}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          aria-label={UI_TEXT.BUTTONS.SEND}
          title={UI_TEXT.BUTTONS.SEND}
          disabled={isDisabled}
          onClick={handleSubmit}
          className={STYLES.BUTTON.SEND}
          style={{ transform: "rotate(90deg)" }}
        >
          <ArrowUp className={DIMENSIONS.ICON.SMALL} />
        </button>
      </div>

      {(showAttachment || showStyling) && (
        <>
          <input
            type="file"
            id="file-input"
            multiple
            accept={FILE_CONFIG.ACCEPTED_FORMATS.join(",")}
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex items-center justify-between px-4 py-2 text-sm border-t border-white/20">
            <div className="flex items-center gap-2">
              {showAttachment && (
                <button
                  className={`${STYLES.BUTTON.ICON} text-black`}
                  aria-label={UI_TEXT.BUTTONS.ADD_ATTACHMENT}
                  onClick={handleAttachmentClick}
                >
                  <Plus className={DIMENSIONS.ICON.SMALL} />
                </button>
              )}
              {showStyling && (
                <button
                  className={`${STYLES.BUTTON.ICON} text-slate-500`}
                  aria-label={UI_TEXT.BUTTONS.STYLING}
                >
                  <Palette
                    className={`${DIMENSIONS.ICON.SMALL} text-slate-500`}
                  />
                  <span className="text-xs text-slate-500">
                    {UI_TEXT.BUTTONS.STYLING}
                  </span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
