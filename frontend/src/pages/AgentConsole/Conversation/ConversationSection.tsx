import Panel from "@/components/ui/Panel";
import ConversationHeader from "./ConversationHeader";
import ConversationComposer from "./ConversationComposer";
import ChatBody from "./ChatBody";

function ConversationSection() {
  return (
    <Panel className="col-span-2 grid grid-rows-[16%_69%_15%] p-0! overflow-hidden!">
      <ConversationHeader />
      <ChatBody />
      <ConversationComposer />
    </Panel>
  );
}

export default ConversationSection;
