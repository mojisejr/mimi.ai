"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Liff } from "@line/liff";

import liff from "@line/liff";

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
};

const initialState: lineContextType = {
  liff: null,
  error: null,
  isInitialized: false,
  login: () => {},
  logout: () => {},
  profile: null,
  isLoggedIn: false,
};

const LineContext = createContext(initialState);

export const LineProvider = ({ children }: Props) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    setInitialized(false);
    initLiff();
  }, []);

  async function initLiff() {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
    if (!liffId) {
      throw Error("LIFF ID Required!");
    }

    try {
      await liff.init({ liffId });
      setLiffObject(liff);

      if (liff.isLoggedIn()) {
        setLoggedIn(true);
        const profile = await liff.getProfile();
        setProfile(profile);
        // await getProfile();
      }
    } catch (error: any) {
      console.log("LIFF init failed.");
      setInitialized(true);
      setLiffError(error.toString());
    } finally {
      setInitialized(true);
    }
  }

  const login = () => {
    if (!liffObject) return;
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

  // const getProfile = async () => {
  //   if (!isLoggedIn) return;
  //   try {
  //     const profile = await liffObject?.getProfile();
  //     console.log("profile: ", profile);
  //     setProfile(profile ?? null);
  //   } catch (error) {
  //     setProfile(null);
  //   }
  // };

  return (
    <LineContext.Provider
      value={{
        liff: liffObject,
        error: liffError,
        isInitialized,
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
