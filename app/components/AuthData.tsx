import { User } from "@prisma/client";
import React, { FC, useContext } from "react";

const AuthContext = React.createContext<User | null>(null);

export const AuthProvider: FC<{ user: User | null }> = ({ user, children }) => {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useMe = () => useContext(AuthContext);
