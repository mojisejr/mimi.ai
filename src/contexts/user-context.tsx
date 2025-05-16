"use client";

import { IUser } from "@/interfaces/i-user-info";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: IUser;
  updateUser: (newUser: IUser) => void;
  updateUserStats: (coins: number, exp: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: IUser;
}) {
  const [user, setUser] = useState<IUser>(initialUser);

  const updateUser = (newUser: IUser) => {
    setUser(newUser);
  };

  const updateUserStats = (coins: number, exp: number) => {
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      exp: prev.exp + exp,
      // อัพเดท level และ exp requirements ถ้าจำเป็น
      ...(prev.exp + exp >= prev.nextExpRequired && {
        level: prev.level + 1,
        currentExpRequired: prev.nextExpRequired,
        nextExpRequired: Math.floor(prev.nextExpRequired * 1.5), // สูตรคำนวณ exp ระดับถัดไป
      }),
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateUserStats }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
