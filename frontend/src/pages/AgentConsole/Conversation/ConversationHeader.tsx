import Button from "@/components/ui/Button/Button";
import ButtonGroup from "@/components/ui/ButtonGroup/ButtonGroup";
type Status = "Open" | "Closed" | "Pending";

interface ConversationHeaderProps {
  title?: string;
  platform?: string;
  customerName?: string;
  status?: Status;
}

function ConversationHeader({
  title,
  platform,
  customerName,
  status,
}: ConversationHeaderProps) {
  title = title || "Default Title";
  platform = platform || "Default Platform";
  customerName = customerName || "Default Customer Name";
  status = status || "Open";
  return (
    <div className="min-h-0 overflow-hidden p-4">
      <div className="flex h-full gap-4">
        {/* Left side */}
        <div className="flex flex-1 flex-col gap-1">
          {/* Title Row and Status */}
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-2">
              <h3 className="text-lg font-bold">{title}</h3>
              <span className="text-sm font-normal bg-green-100 p-1 rounded-md text-green-800">
                ({status})
              </span>
            </div>
            <ButtonGroup
              size="small"
              buttons={[
                {
                  label: "Review First",
                  onClick: () => console.log("Button 1 clicked"),
                },
                {
                  label: "Auto-Send",
                  onClick: () => console.log("Button 2 clicked"),
                },
              ]}
            />
          </div>

          {/* 2nd Row Platform */}
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm font-normal bg-blue-100 p-1 rounded-md text-blue-800">
                {platform}
              </span>
              <span className="text-sm font-normal text-gray-500">
                {customerName}
              </span>
            </div>
          </div>
          {/* 3rd Row Buttons */}
          <div className="mt-2 flex flex-row gap-2">
            <Button size="small" color="clear">
              Pause AI
            </Button>
            <Button size="small" color="black">
              Resolve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationHeader;
