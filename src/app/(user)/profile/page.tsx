"use client";
import { getUser } from "@/actions/get-user-info";
import ProfileCardV2 from "@/components/profile-card-v2";
import ReferralBox from "@/components/referral-box";
import FullScreenContainer from "@/components/ui/full-screen-container";
import { IUser } from "@/interfaces/i-user-info";
import { useLine } from "@/providers/line";
import { UserProvider } from "@/contexts/user-context";
import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/loading-screen";

export default function UserProfilePage() {
  const { profile } = useLine();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetUserInfo = () => {
    setLoading(true);
    if (!profile) return;
    getUser(profile.userId)
      .then((profile) => {
        setUserInfo(profile);
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  if (loading || !userInfo || !profile) {
    return <LoadingScreen />;
  }

  return (
    <FullScreenContainer>
      <div className="flex justify-center">
        <div className="px-6 overflow-y-scroll h-full pt-4 pb-6">
          <UserProvider initialUser={userInfo}>
            <div className="grid grid-col-1 gap-2">
              <ProfileCardV2 image={profile.pictureUrl!} />
              <ReferralBox />
            </div>
          </UserProvider>
        </div>
      </div>
    </FullScreenContainer>
  );
}
