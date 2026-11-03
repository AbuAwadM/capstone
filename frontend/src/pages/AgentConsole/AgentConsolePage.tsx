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

function ChannelSection() {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
        <span className="text-sm text-gray-500"> 1 convrersation </span>
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
