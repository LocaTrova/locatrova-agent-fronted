/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Chat related types (Single Responsibility Principle)
export type ChatRole = "user" | "assistant";

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
}

// Location/Result related types
export interface LocationAttributes {
  indoor: boolean;
  outdoor: boolean;
  permit: boolean;
}

export interface LocationResult {
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  tags: string[];
  attributes: LocationAttributes;
}

// Filter types
export type LocationFilterType =
  | "any"
  | "urban"
  | "coastal"
  | "industrial"
  | "residential"
  | "nature";
export type AttributeFilterType = "indoor" | "outdoor" | "permit";

// Chat input handler interface (Dependency Inversion Principle)
export interface ChatMessageHandler {
  onSend: (content: string) => void;
}

// Result filter interface
export interface ResultFilter {
  locationFilter: LocationFilterType;
  activeFilters: AttributeFilterType[];
}
