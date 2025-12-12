import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type User = {
  firstName: string| null;
  lastName: string | null;
  phoneNumber: string;
  profilePhoto: string | null | undefined;
  avatarIndex: number | null | undefined;
};

export type UserContextType = {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
  setUser: (value: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const saveUser = async (newUser: User) => {
    setUser(newUser);
    // await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateUser =async (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
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
    <UserContext.Provider value={{ user, clearUser, setUser: saveUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
