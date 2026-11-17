// Types mirror backend/modules/conversations/schemas.py.

export type Platform = "whatsapp" | "instagram" | "facebook" | "telegram";
export type ConversationStatus = "open" | "pending" | "closed";
export type AIMode = "review_first" | "auto_send";

export interface CustomerSummary {
  id: number;
  name: string;
  profile_picture_url: string | null;
}

export interface Conversation {
  id: number;
  title: string;
  platform: Platform;
  status: ConversationStatus;
  ai_mode: AIMode;
  ai_paused: boolean;
  last_message_at: string; // ISO date
  customer: CustomerSummary;
}

// Relative URL: in dev, Vite proxies /api to the backend (see vite.config.ts).
const BASE_URL = "/api/conversations";

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function fetchConversations(signal?: AbortSignal) {
  return getJson<Conversation[]>(BASE_URL, signal);
}
