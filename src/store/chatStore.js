import { create } from 'zustand';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const seedUsers = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'u3', name: 'Charlie' },
  { id: 'u4', name: 'Diana' },
];

const initialDirect = [
  {
    id: 'd1',
    type: 'direct',
    name: 'Alice ↔ Bob',
    participants: ['u1', 'u2'],
    messages: [],
  },
];

const initialGroup = [
  {
    id: 'g1',
    type: 'group',
    name: 'Design Team',
    members: [seedUsers[0], seedUsers[2]],
    adminId: 'u1',
    messages: [],
  },
];

const findUser = (users, id) => users.find((u) => u.id === id);

const useChatStore = create((set, get) => ({
  currentUser: seedUsers[0],
  allUsers: seedUsers,
  conversations: [...initialDirect, ...initialGroup],
  activeConversationId: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  get activeConversation() {
    const { conversations, activeConversationId } = get();
    return conversations.find((c) => c.id === activeConversationId) || null;
  },

  createGroup: (name) =>
    set((state) => {
      const newGroup = {
        id: uid(),
        type: 'group',
        name,
        members: [state.currentUser],
        adminId: state.currentUser.id,
        messages: [],
      };
      return { conversations: [newGroup, ...state.conversations], activeConversationId: newGroup.id };
    }),

  addMemberToGroup: (groupId, userId) =>
    set((state) => {
      const convos = state.conversations.map((c) => {
        if (c.id !== groupId || c.type !== 'group') return c;
        // Only admin can add
        if (c.adminId !== state.currentUser.id) return c;
        const user = findUser(state.allUsers, userId);
        if (!user || c.members.some((m) => m.id === userId)) return c;
        return { ...c, members: [...c.members, user] };
      });
      return { conversations: convos };
    }),

  removeMemberFromGroup: (groupId, userId) =>
    set((state) => {
      const convos = state.conversations.map((c) => {
        if (c.id !== groupId || c.type !== 'group') return c;
        if (c.adminId !== state.currentUser.id) return c;
        return { ...c, members: c.members.filter((m) => m.id !== userId) };
      });
      return { conversations: convos };
    }),

  sendMessage: (conversationId, payload) =>
    set((state) => {
      const { currentUser } = state;
      const now = Date.now();
      const convos = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const message = {
          id: uid(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: payload.text || '',
          mediaUrl: payload.mediaUrl || '',
          createdAt: now,
        };
        return { ...c, messages: [...c.messages, message] };
      });
      return { conversations: convos };
    }),
}));

export default useChatStore;
