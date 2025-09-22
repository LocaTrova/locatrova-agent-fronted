/**
 * Reusable style constants
 * Following DRY principle - Centralized styling patterns
 */

export const STYLES = {
  // Container styles
  CONTAINER: {
    SECTION:
      "flex h-full min-h-0 flex-col bg-white/60 backdrop-blur-md",
    INPUT_WRAPPER:
      "relative w-full backdrop-blur-md bg-white/60 border border-white/30 rounded-2xl sm:rounded-[30px] shadow-[0_0_0_0_rgba(0,0,0,0),0_8px_16px_0_rgba(0,0,0,0.04)] px-2",
    PAGE: "relative h-screen min-h-screen w-full overflow-hidden",
    PAGE_INNER: "mx-auto max-w-screen-2xl h-full px-3 sm:px-6 py-4 sm:py-6",
  },

  // Input styles
  INPUT: {
    TEXTAREA:
      "mt-2 h-[120px] max-h-[240px] min-h-[110px] w-full resize-none rounded-[30px] border border-slate-300/60 bg-white/80 pl-6 pr-16 pt-3 text-base/6 font-light text-slate-800 placeholder:text-slate-400 focus:outline-none",
    TEXTAREA_INDEX:
      "mt-2 h-[120px] max-h-[200px] min-h-[110px] w-full resize-none rounded-2xl pl-6 pr-16 pt-3 text-base/6 font-light text-slate-800 placeholder:text-slate-400 focus:outline-none",
  },

  // Button styles
  BUTTON: {
    SEND: "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(255,152,59)] text-black transition ui-focus disabled:cursor-not-allowed disabled:opacity-70",
    ICON: "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-slate-50 ui-focus",
    GHOST: "h-8 text-xs",
  },

  // Sticky elements
  STICKY: {
    BOTTOM:
      "sticky bottom-0 border-t border-white/20 p-2 sm:p-3 bg-white/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/40 pb-safe",
    TOP: "sticky top-0 z-10 border-b border-white/20 bg-white/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/30",
  },

  // Spacing
  SPACING: {
    SECTION_GAP: "gap-4 sm:gap-6",
    CONTENT_GAP: "space-y-3 sm:space-y-4",
    PADDING_RESPONSIVE: "px-3 sm:px-4",
    PADDING_SMALL: "p-2 sm:p-3",
    PADDING_MEDIUM: "p-3 sm:p-4",
  },

  // Scrollable areas
  SCROLL: {
    AREA: "flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]",
    AREA_WITH_BOTTOM:
      "flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable] pb-24 lg:pb-2",
  },

  // Grid layouts
  GRID: {
    CHAT_LAYOUT:
      "grid h-full min-h-0 grid-cols-1 gap-0 lg:grid-cols-[30%_70%]",
    APPS_LAYOUT:
      "mt-16 grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  },

  // Decorative elements
  DECORATIVE: {
    GRADIENT_CIRCLE:
      "absolute rounded-full bg-gradient-to-br blur-2xl opacity-30",
  },
} as const;

// Component-specific style combinations
export const COMPONENT_STYLES = {
  MESSAGE_BUBBLE: {
    USER: "bg-slate-200 text-slate-800",
    ASSISTANT: "bg-white text-slate-800 border border-slate-200",
    WRAPPER_USER: "flex justify-end",
    WRAPPER_ASSISTANT: "flex",
    CONTENT:
      "max-w-[90%] sm:max-w-[85%] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-5",
  },

  CARD: {
    BASE: "ui-card p-3 transition hover:shadow-sm",
    IMAGE_CONTAINER:
      "relative flex h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg bg-slate-100",
    BADGE:
      "rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600",
  },
} as const;
