import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string | null;
  avatarIndex?: number | null;
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const dispatchUser = async (newUser: User) => {
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  const clearUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, clearUser, setUser: dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
