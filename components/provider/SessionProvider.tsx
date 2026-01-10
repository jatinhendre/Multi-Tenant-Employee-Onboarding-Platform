"use client";

import React, { createContext, useContext } from "react";

// Define the shape of your User and Company based on your models
interface User {
  _id: string;
  email: string;
  role: "COMPANY_ADMIN" | "SUPERADMIN" | "EMPLOYEE";
  company?: string | null; // ID reference
}
interface ISessionCompany {
  _id: string;
  name: string;
  dbName: string;
  status:string
}

interface SessionContextType {
  user: User | null;
  company: ISessionCompany | null;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  company: null,
});

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({
  children,
  user,
  company,
}: {
  children: React.ReactNode;
  user: User | null;
  company: ISessionCompany | null;
}) {
  return (
    <SessionContext.Provider value={{ user, company }}>
      {children}
    </SessionContext.Provider>
  );
}