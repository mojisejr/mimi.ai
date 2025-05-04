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
import { addNewUserIfNotExist } from "@/actions/add-user-info";
import { getUser } from "@/actions/get-user-info";

export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  currentPoint: number;
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
  getProfile: () => void;
  profileLoading: boolean;
};

const initialState: lineContextType = {
  liff: null,
  error: null,
  isInitialized: false,
  login: () => {},
  logout: () => {},
  profile: null,
  isLoggedIn: false,
  getProfile: () => {},
  profileLoading: false,
};

const LineContext = createContext(initialState);

export const LineProvider = ({ children }: Props) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    setInitialized(false);
    initLiff();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Log out triggered try to login");
      if (!liffObject) return;
      liffObject?.login();
    }
    console.log("LOGGED IN");
  }, [isLoggedIn]);

  async function initLiff() {
    const liffId =
      process.env.NODE_ENV == "development"
        ? process.env.NEXT_PUBLIC_LIFF_DEV_ID!
        : process.env.NEXT_PUBLIC_LIFF_ID!;
    if (!liffId) {
      throw Error("LIFF ID Required!");
    }

    try {
      console.log("Initializing LIFF");
      await liff.init({ liffId });
      setLiffObject(liff);

      if (liff.isLoggedIn()) {
        console.log("User has logged In");
        setLoggedIn(true);
        const profile = await liff.getProfile();

        await addNewUserIfNotExist({
          lineId: profile.userId,
          name: profile.displayName,
        });

        const userData = await getUser(profile.userId);

        setProfile({
          ...profile,
          currentPoint: (userData?.point as number) || 0,
        });
        // await getProfile();
      } else if (!liff.isLoggedIn()) {
        console.log("No Logged In set isLoggedIn to false");
        setLoggedIn(false);
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

  const getProfile = async () => {
    setProfileLoading(true);
    if (!isLoggedIn) return;
    try {
      const profile = await liffObject?.getProfile();
      if (!profile?.userId) {
        setProfile(null);
        return;
      }
      const userData = await getUser(profile.userId);
      setProfile({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
        currentPoint: (userData?.point as number) || 0,
      });
      setProfileLoading(false);
    } catch (error) {
      setProfile(null);
      setProfileLoading(false);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <LineContext.Provider
      value={{
        liff: liffObject,
        error: liffError,
        getProfile,
        profileLoading,
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
