/**
 * Application-wide constants
 * Following DRY principle - Single source of truth for all magic values
 */

// UI Dimensions
export const DIMENSIONS = {
  INPUT: {
    MIN_HEIGHT: "110px",
    DEFAULT_HEIGHT: "120px",
    MAX_HEIGHT_CHAT: "240px",
    MAX_HEIGHT_INDEX: "200px",
  },
  DECORATIVE: {
    LARGE_CIRCLE: "2215px",
    MEDIUM_CIRCLE: "1348px",
  },
  ICON: {
    SMALL: "h-4 w-4",
    MEDIUM: "h-5 w-5",
    LARGE: "h-6 w-6",
  },
} as const;

// Timing & Delays
export const TIMING = {
  ASSISTANT_RESPONSE_DELAY: 400,
  ANIMATION_STAGGER_BASE: 100,
  DEBOUNCE_DELAY: 300,
} as const;

// Text Content
export const MESSAGES = {
  ASSISTANT: {
    INITIAL_WITH_SEED:
      "Great brief. I'll suggest a few options and refine as we chat.",
    INITIAL_NO_SEED:
      "Describe the scene you need (e.g., 'sunlit loft with brick walls') and I'll curate locations.",
    RESPONSE_DEFAULT: "Got it. Refining matches based on your brief.",
  },
  PLACEHOLDERS: {
    SEARCH_DEFAULT: "Describe the scene or location you want to scout...",
    SEARCH_INDEX: "e.g. sunlit loft with brick walls",
    MAP_VIEW_COMING: 'Coming soon. Toggle off "Map" to see the list.',
  },
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  ACCEPTED_FORMATS: [".jpg", ".jpeg", ".png", ".pdf", ".txt", ".html"],
  ACCEPTED_TYPES: "image/*,application/pdf,text/*",
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_UPDATE_TEXT: "Updated 15 days ago",
  DEFAULT_TIMEOUT: 5000,
} as const;

// UI Text
export const UI_TEXT = {
  BUTTONS: {
    CLEAR: "Clear",
    SEND: "Send message",
    ADD_ATTACHMENT: "Add attachment",
    STYLING: "Styling Instructions",
  },
  LABELS: {
    CURATED_RESULTS: "Curated results",
    MAP: "Map",
    MAP_VIEW: "Map view",
    CURATE_BY: "Curate by:",
    LOCATION: "Location",
  },
  FILTERS: {
    INDOOR: "Indoor",
    OUTDOOR: "Outdoor",
    PERMIT: "Permit",
  },
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  APPS: "/apps",
  CHAT: "/chat",
  NOT_FOUND: "*",
} as const;
