import React from 'react';
import { X, Trash, Plus } from 'lucide-react';
import useChatStore from '../store/chatStore';

export default function GroupManager({ open, onClose }) {
  const { activeConversation, currentUser, addMemberToGroup, removeMemberFromGroup, allUsers } = useChatStore();

  if (!open || !activeConversation || activeConversation.type !== 'group') return null;

  const isAdmin = activeConversation.adminId === currentUser.id;

  const [query, setQuery] = React.useState('');
  const candidates = allUsers.filter(
    (u) =>
      !activeConversation.members.some((m) => m.id === u.id) &&
      u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border rounded-lg shadow-xl w-full max-w-lg p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Manage Group</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Only admins can add or remove members.
        </div>

        <div className="mt-4">
          <div className="text-xs font-semibold mb-2">Members</div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {activeConversation.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between border rounded-md px-2 py-1">
                <div className="text-sm">{m.name}</div>
                {isAdmin && m.id !== currentUser.id && (
                  <button
                    onClick={() => removeMemberFromGroup(activeConversation.id, m.id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  >
                    <Trash className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold mb-2">Add people</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name..."
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
            {candidates.length === 0 && (
              <div className="text-xs text-muted-foreground">No matches</div>
            )}
            {candidates.map((u) => (
              <div key={u.id} className="flex items-center justify-between border rounded-md px-2 py-1">
                <div className="text-sm">{u.name}</div>
                {isAdmin ? (
                  <button
                    onClick={() => addMemberToGroup(activeConversation.id, u.id)}
                    className="inline-flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">Admin only</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
