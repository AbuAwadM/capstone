type Platform = "instagram" | "facebook" | "whatsapp" | "telegram";

const PLATFORMS: Record<Platform, { label: string; badge: string }> = {
  instagram: { label: "Instagram", badge: "bg-pink-100 text-pink-700" },
  facebook: { label: "Facebook", badge: "bg-blue-100 text-blue-700" },
  whatsapp: { label: "WhatsApp", badge: "bg-green-100 text-green-700" },
  telegram: { label: "Telegram", badge: "bg-sky-100 text-sky-700" },
};

export interface InboxItemProps {
  id: number;
  profilePicture: string;
  sender: string;
  time: string;
  platform: Platform;
}

function InboxItem({
  profilePicture,
  sender,
  time,
  platform,
}: Omit<InboxItemProps, "id">) {
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

export default InboxItem;