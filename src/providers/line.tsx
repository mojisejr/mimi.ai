"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Liff } from "@line/liff";
import { redirect } from "next/navigation";

export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

type Props = {
  children: ReactNode;
};

export type lineContextType = {
  liff: Liff | null;
  error: string | null;
  isInitialized: boolean;
  login: () => void;
  logout: () => void;
  profile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const initialState: lineContextType = {
  liff: null,
  error: null,
  isInitialized: false,
  login: () => {},
  logout: () => {},
  profile: null,
  isLoggedIn: false,
  isLoading: false,
};

const LineContext = createContext(initialState);

export const LineProvider = ({ children }: Props) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    setInitialized(false);
    // updateLoggedInState();
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            liff.isLoggedIn() ? setLoggedIn(true) : setLoggedIn(false);
            setInitialized(true);
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setInitialized(true);
            setLiffError(error.toString());
          })
          .finally(() => setInitialized(true));
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn && isInitialized) {
      void getProfile();
    }
  }, [isLoggedIn, isInitialized]);

  function updateLoggedInState() {
    console.log("status update to: ", liffObject?.isLoggedIn());
    liffObject?.isLoggedIn() ? setLoggedIn(true) : setLoggedIn(false);
  }

  const login = () => {
    if (!liffObject?.isLoggedIn()) {
      liffObject?.login();
    }
  };

  const logout = () => {
    if (liffObject?.isLoggedIn()) {
      liffObject?.logout();
      setLoggedIn(false);
    }
  };

  const getProfile = async () => {
    try {
      const profile = await liffObject?.getProfile();
      setProfile(profile ?? null);
    } catch (error) {
      setProfile(null);
    }
  };

  return (
    <LineContext.Provider
      value={{
        liff: liffObject,
        error: liffError,
        isInitialized,
        isLoading,
        login,
        logout,
        profile,
        isLoggedIn,
      }}
    >
      {children}
    </LineContext.Provider>
  );
};

export const useLine = () => {
  return useContext(LineContext);
};
