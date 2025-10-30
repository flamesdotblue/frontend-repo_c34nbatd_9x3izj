import React, { useMemo } from 'react';
import { MessageSquare, Users, Plus } from 'lucide-react';
import useChatStore from '../store/chatStore';

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const ConversationItem = ({ convo, active, onClick }) => {
  const isGroup = convo.type === 'group';
  const last = convo.messages[convo.messages.length - 1];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors border ${
        active ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold truncate">{convo.name}</div>
        {isGroup ? (
          <Users className="w-4 h-4 text-muted-foreground" />
        ) : (
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      {last && (
        <div className="mt-1 text-xs text-muted-foreground truncate">
          {last.senderName}: {last.text || (last.mediaUrl ? 'Sent a media' : '')}
        </div>
      )}
    </button>
  );
};

export default function ChatSidebar() {
  const { conversations, setActiveConversationId, activeConversationId, createGroup } = useChatStore();
  const [tab, setTab] = React.useState('direct');

  const filtered = useMemo(
    () => conversations.filter((c) => c.type === tab),
    [conversations, tab]
  );

  const handleNewGroup = () => {
    const name = prompt('Group name');
    if (!name) return;
    createGroup(name);
    setTab('group');
  };

  return (
    <aside className="w-full md:w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-bold">Chats</div>
        <div className="mt-3 flex items-center gap-2">
          <TabButton icon={MessageSquare} label="Direct" active={tab === 'direct'} onClick={() => setTab('direct')} />
          <TabButton icon={Users} label="Groups" active={tab === 'group'} onClick={() => setTab('group')} />
          <button
            onClick={handleNewGroup}
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
            title="New Group"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No conversations yet.</div>
        )}
        {filtered.map((c) => (
          <ConversationItem
            key={c.id}
            convo={c}
            active={c.id === activeConversationId}
            onClick={() => setActiveConversationId(c.id)}
          />
        ))}
      </div>
    </aside>
  );
}
