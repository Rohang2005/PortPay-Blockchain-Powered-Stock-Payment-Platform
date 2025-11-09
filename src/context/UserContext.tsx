import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- TYPE DEFINITIONS ---
interface Transaction {
  id: string;
  name: string;
  type: 'sent' | 'received';
  amount: number;
  timestamp: string;
  initials: string;
  blockchainTxId?: string;
}

interface User {
  uid: string;
  walletAddress: string;
  portfolioValue: number;
  transactions: Transaction[];
}

interface UserContextType {
  currentUser: User | null;
  users: Record<string, User>;
  login: (uid: string) => boolean;
  logout: () => void;
  addTransaction: (fromUid: string, toUid: string, amount: number, blockchainTxId: string) => void;
}

// --- INITIAL DUMMY DATA ---
const initialUsers: Record<string, User> = {
  "User1@zerodha": {
    uid: "User1@zerodha",
    walletAddress: "0xFFD1a20Fe950864d874b2F9DD0a4094Be10d0CA3",
    portfolioValue: 1245680,
    transactions: [
      { id: "tx1", name: "Priya Verma", type: "received", amount: 12500, timestamp: "Yesterday, 11:45 AM", initials: "PV" },
      { id: "tx2", name: "Amazon India", type: "sent", amount: 3200, timestamp: "Yesterday, 6:20 PM", initials: "AI" },
    ],
  },
  "user2@zerodha": {
    uid: "user2@zerodha",
    walletAddress: "0xc9dCe4b054A0FD3506a8314D1df7a27BCA925B64",
    portfolioValue: 880000,
    transactions: [],
  },
  "user3@zerodha": {
    uid: "user3@zerodha",
    walletAddress: "0x23D34A4cBE741D13317b5B3A4df631E6D49A07CF",
    portfolioValue: 540200,
    transactions: [],
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>(initialUsers);

  const login = (uid: string): boolean => {
    const userToLogin = users[uid];
    if (userToLogin) {
      setCurrentUser(userToLogin);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTransaction = (fromUid: string, toUid: string, amount: number, blockchainTxId: string) => {
    const fromUser = users[fromUid];
    const toUser = users[toUid];

    if (!fromUser || !toUser) return;

    const newSenderTransaction: Transaction = {
      id: `tx_${Date.now()}_sent`,
      name: toUser.uid,
      type: 'sent',
      amount,
      timestamp: new Date().toLocaleString(),
      initials: toUser.uid.substring(0, 2).toUpperCase(),
      blockchainTxId,
    };

    const newReceiverTransaction: Transaction = {
      id: `tx_${Date.now()}_received`,
      name: fromUser.uid,
      type: 'received',
      amount,
      timestamp: new Date().toLocaleString(),
      initials: fromUser.uid.substring(0, 2).toUpperCase(),
      blockchainTxId,
    };

    setUsers(prevUsers => {
      const updatedUsers = { ...prevUsers };

      // Update sender
      updatedUsers[fromUid] = {
        ...fromUser,
        portfolioValue: fromUser.portfolioValue - amount,
        transactions: [newSenderTransaction, ...fromUser.transactions],
      };
      
      // Update receiver
      updatedUsers[toUid] = {
        ...toUser,
        portfolioValue: toUser.portfolioValue + amount,
        transactions: [newReceiverTransaction, ...toUser.transactions],
      };

      // Update current user state if they are the sender
      if (currentUser?.uid === fromUid) {
        setCurrentUser(updatedUsers[fromUid]);
      }

      return updatedUsers;
    });
  };

  const value = { currentUser, users, login, logout, addTransaction };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

