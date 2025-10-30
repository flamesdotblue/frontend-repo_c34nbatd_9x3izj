import React from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import GroupManager from './components/GroupManager';
import useChatStore from './store/chatStore';
import { Users } from 'lucide-react';

function App() {
  const { activeConversation } = useChatStore();
  const [manageOpen, setManageOpen] = React.useState(false);

  return (
    <div className="min-h-screen h-screen bg-background text-foreground">
      <div className="h-full max-w-7xl mx-auto grid grid-rows-[auto_1fr]">
        <header className="border-b px-4 py-3 flex items-center gap-2">
          <div className="font-bold tracking-tight text-lg">Flames Chat</div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            {activeConversation?.type === 'group' && (
              <button
                onClick={() => setManageOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-muted"
                title="Manage group"
              >
                <Users className="w-4 h-4" />
                Manage
              </button>
            )}
            <a
              href="https://flames.blue"
              target="_blank"
              rel="noreferrer"
              className="underline hover:no-underline"
            >
              Help
            </a>
          </div>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-full">
          <ChatSidebar />
          <section className="flex flex-col h-full">
            <ChatWindow />
            <MessageInput />
          </section>
        </main>
      </div>

      <GroupManager open={manageOpen} onClose={() => setManageOpen(false)} />
    </div>
  );
}

export default App;
