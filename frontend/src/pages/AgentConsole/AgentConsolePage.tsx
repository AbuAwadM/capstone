import { useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import dummyConversationsData from "../../data/dummyConversationsData.json";

interface PanelProps {
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
}

function Panel({ bgColor = "bg-white", className = "", children }: PanelProps) {
  return (
    <section
      className={`overflow-y-auto rounded-lg p-4 ${bgColor} ${className}`}
    >
      {children}
    </section>
  );
}

type Platform = "instagram" | "facebook" | "whatsapp" | "telegram";

const PLATFORMS: Record<Platform, { label: string; badge: string }> = {
  instagram: { label: "Instagram", badge: "bg-pink-100 text-pink-700" },
  facebook: { label: "Facebook", badge: "bg-blue-100 text-blue-700" },
  whatsapp: { label: "WhatsApp", badge: "bg-green-100 text-green-700" },
  telegram: { label: "Telegram", badge: "bg-sky-100 text-sky-700" },
};

interface Conversation {
  id: number;
  profilePicture: string;
  sender: string;
  time: string;
  platform: Platform;
}

const CONVERSATIONS = dummyConversationsData as Conversation[];

function MessagePreview({
  profilePicture,
  sender,
  time,
  platform,
}: Omit<Conversation, "id">) {
  const { label, badge } = PLATFORMS[platform];

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
      <div className="flex items-center space-x-2">
        <div
          className="h-8 w-8 rounded-full bg-gray-300 bg-cover bg-center"
          style={{ backgroundImage: `url(${profilePicture})` }}
        ></div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-medium text-gray-900">{sender}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}
          >
            {label}
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

function ChannelSection() {
  const [query, setQuery] = useState("");

  const filteredConversations = CONVERSATIONS.filter(({ sender }) =>
    sender.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
        <span className="text-sm text-gray-500">
          {CONVERSATIONS.length} conversations
        </span>
      </div>

      <SearchBar
        className="my-4"
        value={query}
        placeholder="Search conversations"
        onChange={(event) => setQuery(event.target.value)}
      />
      <hr className="border-gray-200" />
      <div className="mt-4 space-y-2">
        {filteredConversations.map(({ id, ...conversation }) => (
          <MessagePreview key={id} {...conversation} />
        ))}
        {filteredConversations.length === 0 && (
          <p className="p-2 text-sm text-gray-500">No conversations found</p>
        )}
      </div>
    </Panel>
  );
}

function MessageSection() {
  return <Panel className="col-span-2">Messages</Panel>;
}

function InsightsSection() {
  return <Panel>Insights</Panel>;
}

function AgentConsolePage() {
  return (
    <div className="grid h-full grid-cols-4 grid-rows-1 gap-4 p-4">
      <ChannelSection />
      <MessageSection />
      <InsightsSection />
    </div>
  );
}

export default AgentConsolePage;
