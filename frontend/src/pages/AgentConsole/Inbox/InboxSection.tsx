import { useEffect, useState } from "react";
import Panel from "@/components/ui/Panel";
import SearchBar from "@/components/ui/SearchBar";
import { fetchConversations, type Conversation } from "@/api/conversations";
import InboxItem from "./InboxItem";

// "10:30 AM" for today, "Yesterday", otherwise "Nov 5".
function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  if (date >= startOfToday) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (date >= startOfYesterday) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function initialsAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return `https://placehold.co/64?text=${encodeURIComponent(initials)}`;
}

function InboxSection() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Abort the request if the page is left before it finishes.
    const controller = new AbortController();

    fetchConversations(controller.signal)
      .then(setConversations)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load conversations");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filteredConversations = conversations.filter(({ customer }) =>
    customer.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
        <span className="text-sm text-gray-500">
          {conversations.length} conversations
        </span>
      </div>

      <div className="mt-4">
        <SearchBar
          value={query}
          placeholder="Search conversations..."
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <hr className="mt-4 border-gray-300" />

      <div className="mt-4 space-y-2">
        {isLoading && (
          <p className="p-2 text-sm text-gray-500">Loading conversations...</p>
        )}
        {error && <p className="p-2 text-sm text-red-600">{error}</p>}
        {!isLoading &&
          !error &&
          filteredConversations.map((conversation) => (
            <InboxItem
              key={conversation.id}
              profilePicture={
                conversation.customer.profile_picture_url ??
                initialsAvatar(conversation.customer.name)
              }
              sender={conversation.customer.name}
              time={formatTime(conversation.last_message_at)}
              platform={conversation.platform}
            />
          ))}
        {!isLoading && !error && filteredConversations.length === 0 && (
          <p className="p-2 text-sm text-gray-500">No conversations found</p>
        )}
      </div>
    </Panel>
  );
}

export default InboxSection;
