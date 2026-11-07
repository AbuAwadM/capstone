import { useState } from "react";
import Panel from "@/components/ui/Panel";
import SearchBar from "@/components/ui/SearchBar";
import dummyConversationsData from "@/data/dummyConversationsData.json";
import InboxItem, { type InboxItemProps } from "./InboxItem";

const InboxItemList = dummyConversationsData as InboxItemProps[];

function InboxSection() {
  const [query, setQuery] = useState("");

  const filteredItems = InboxItemList.filter(({ sender }) =>
    sender.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
        <span className="text-sm text-gray-500">
          {InboxItemList.length} conversations
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
        {filteredItems.map(({ id, ...conversation }) => (
          <InboxItem key={id} {...conversation} />
        ))}
        {filteredItems.length === 0 && (
          <p className="p-2 text-sm text-gray-500">No conversations found</p>
        )}
      </div>
    </Panel>
  );
}

export default InboxSection;
