import React, { createContext, useContext, useState } from "react";

export type TemporaryUser = {
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string | null;
  avatarIndex?: number | null;
};

export type TemporaryUserContextType = {
  tempUser: TemporaryUser;
  setTempUser: (value: TemporaryUser) => void;
  updateTempUser: (data: Partial<TemporaryUser>) => void;
  clearTempUser: () => void;
};

const TemporaryUserContext = createContext<TemporaryUserContextType | null>(
  null
);

const TempUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [tempUser, setTempUser] = useState<TemporaryUser>({});

  const updateTempUser = (data: Partial<TemporaryUser>) => {
    setTempUser((prev) => ({ ...prev, ...data }));
  };

  const clearTempUser = () => setTempUser({});

  return (
    <TemporaryUserContext.Provider
      value={{ tempUser, setTempUser, updateTempUser, clearTempUser }}
    >
      {children}
    </TemporaryUserContext.Provider>
  );
};

export const useTempUserContext = () => {
  const context = useContext(TemporaryUserContext);
  if (!context) {
    throw new Error(
      "TemporaryUserContext must be used within a TempUserProvider"
    );
  }
  return context;
};
export default TempUserProvider;
