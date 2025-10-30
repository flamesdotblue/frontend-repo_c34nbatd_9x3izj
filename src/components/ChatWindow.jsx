import React from 'react';
import useChatStore from '../store/chatStore';

const MediaPreview = ({ url }) => {
  if (!url) return null;
  const isImage = url.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
  return (
    <div className="mt-2">
      {isImage && (
        <img src={url} alt="media" className="rounded-md max-h-64 object-cover" />
      )}
      {isVideo && (
        <video src={url} controls className="rounded-md max-h-64" />
      )}
      {!isImage && !isVideo && (
        <a href={url} target="_blank" rel="noreferrer" className="text-primary underline">
          View attachment
        </a>
      )}
    </div>
  );
};

export default function ChatWindow() {
  const { activeConversation, currentUser } = useChatStore();

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">{activeConversation.name}</div>
          {activeConversation.type === 'group' && (
            <div className="text-xs text-muted-foreground">
              Members: {activeConversation.members.map((m) => m.name).join(', ')}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          You are signed in as <span className="font-medium">{currentUser.name}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation.messages.length === 0 && (
          <div className="text-sm text-muted-foreground">No messages yet. Say hi!</div>
        )}
        {activeConversation.messages.map((msg) => (
          <div key={msg.id} className={`max-w-[80%] ${msg.senderId === currentUser.id ? 'ml-auto' : ''}`}>
            <div className={`px-3 py-2 rounded-lg border ${msg.senderId === currentUser.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'}`}>
              {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
              {msg.mediaUrl && <MediaPreview url={msg.mediaUrl} />}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
