function MessageBubble({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isUser
            ? "bg-blue-500 text-white border border-blue-500"
            : "bg-white text-black border border-gray-300"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

const messages = [
  { message: "Hello! How can I assist you today?", isUser: false },
  { message: "I have a question about my order.", isUser: true },
  { message: "Sure! Can you provide your order number?", isUser: false },
  { message: "Yes, it's #12345.", isUser: true },
  { message: "Thank you! Let me check that for you.", isUser: false },
  {
    message:
      "I see order #12345 was shipped on Monday and is currently in transit.",
    isUser: false,
  },
  {
    message: "The tracking says it's been stuck for 3 days though.",
    isUser: true,
  },
  {
    message:
      "I'm sorry about that. It looks like there was a delay at the regional sorting facility.",
    isUser: false,
  },
  { message: "When can I expect it to arrive?", isUser: true },
  {
    message:
      "The updated estimate is this Thursday. I'll keep an eye on it for you.",
    isUser: false,
  },
  { message: "What if it doesn't arrive by then?", isUser: true },
  {
    message:
      "If it hasn't arrived by Friday, we can send a replacement or issue a full refund — whichever you prefer.",
    isUser: false,
  },
  { message: "A replacement would be great in that case.", isUser: true },
  {
    message:
      "Noted! I've added that to your order. Is there anything else I can help with?",
    isUser: false,
  },
  { message: "No, that's all. Thanks for your help!", isUser: true },
  {
    message: "You're welcome! Have a great day. 😊",
    isUser: false,
  },
];

function ChatBody() {
  return (
    <div className="flex flex-col p-4 h-full overflow-y-auto bg-zinc-100">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg.message} isUser={msg.isUser} />
      ))}
    </div>
  );
}

export default ChatBody;
