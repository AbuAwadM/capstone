interface ComposerProps {
  placeholder?: string;
  platform?: string;
  username?: string;
  status?: string;
}

function inputComposer(props: ComposerProps) {
  const { placeholder, platform, username, status } = props;

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-300">
      <input
        type="text"
        placeholder={placeholder || "Type a message..."}
        className="flex-grow p-2 border rounded"
      />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}       



function ConversationComposer(props: ComposerProps) {
  const { placeholder, platform, username, status } = props;

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-300">
      <input
        type="text"
        placeholder={placeholder || "Type a message..."}
        className="flex-grow p-2 border rounded"
      />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}

export default ConversationComposer;
