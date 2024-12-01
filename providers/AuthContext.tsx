"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profile_picture: string;
  description: string;
  cover_picture: string;
}

interface AuthContextProps {
  currentUser: User | null;
  isLoggedIn: boolean;
  setAuthUser: (user: User | null) => void;
  setLoggedIn: (loggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  // Initialize values from localStorage after the component is mounted
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (storedLoggedIn) {
      setLoggedIn(JSON.parse(storedLoggedIn));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const setAuthUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const setLoggedInStatus = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, setAuthUser, setLoggedIn: setLoggedInStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
