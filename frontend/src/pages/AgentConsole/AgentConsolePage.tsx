import InboxSection from "./Inbox/InboxSection";
import InfoSection from "./Info/InfoSection";
import ConversationSection from "./Conversation/ConversationSection";

function AgentConsolePage() {
  return (
    <div className="grid h-full grid-cols-4 grid-rows-1 gap-4 p-4">
      <InboxSection />
      <ConversationSection />
      <InfoSection />
    </div>
  );
}

export default AgentConsolePage;
