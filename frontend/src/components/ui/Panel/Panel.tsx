interface PanelProps {
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
}

function Panel({ bgColor = "bg-white", className = "", children }: PanelProps) {
  return (
    <section
      className={`overflow-y-auto rounded-lg p-4 border border-gray-200 ${bgColor} ${className}`}
    >
      {children}
    </section>
  );
}

export default Panel;
