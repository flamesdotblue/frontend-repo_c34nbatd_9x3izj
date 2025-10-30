import React from 'react';
import { Send, Paperclip } from 'lucide-react';
import useChatStore from '../store/chatStore';

export default function MessageInput() {
  const { activeConversationId, sendMessage } = useChatStore();
  const [text, setText] = React.useState('');
  const [mediaFile, setMediaFile] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleSend = async () => {
    if (!activeConversationId) return;
    if (!text && !mediaFile) return;

    let mediaUrl = '';
    if (mediaFile) {
      // Create a local object URL for preview. In a real app you'd upload to server/cloud.
      mediaUrl = URL.createObjectURL(mediaFile);
    }

    sendMessage(activeConversationId, { text: text.trim(), mediaUrl });
    setText('');
    setMediaFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <button
          className="p-2 rounded-md border hover:bg-muted"
          onClick={() => fileInputRef.current?.click()}
          title="Attach media"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSend}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          disabled={!text && !mediaFile}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
      {mediaFile && (
        <div className="mt-2 text-xs text-muted-foreground">Attached: {mediaFile.name}</div>
      )}
    </div>
  );
}
