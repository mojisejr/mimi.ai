import { useEffect, useState } from "react";
import { getDailyLoginStatus, claimDailyLogin } from "@/actions/daily-login";

export const useDailyLogin = (lineId: string) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const result = await getDailyLoginStatus(lineId);
      if (result.success) {
        setStatus(result.data);

        // ถ้ายังไม่ได้ claim วันนี้ ให้แสดง dialog
        if (!result.data?.hasClaimedToday) {
          setShowDialog(true);
        } else {
          // ถ้า claim แล้ว ให้ตรวจสอบว่าเคยแสดง dialog วันนี้หรือยัง
          const lastShown = localStorage.getItem(`daily_login_shown_${lineId}`);
          const today = new Date().toDateString();

          if (lastShown !== today) {
            setShowDialog(true);
            localStorage.setItem(`daily_login_shown_${lineId}`, today);
          } else {
            setShowDialog(false);
          }
        }
      }
    } catch (error) {
      console.error("Error checking daily login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (isClaiming) return;

    try {
      setIsClaiming(true);
      const result = await claimDailyLogin(lineId);
      if (result.success) {
        await checkStatus();
        // บันทึกว่าได้แสดง dialog วันนี้แล้ว
        localStorage.setItem(
          `daily_login_shown_${lineId}`,
          new Date().toDateString()
        );
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    // บันทึกว่าได้แสดง dialog วันนี้แล้ว
    localStorage.setItem(
      `daily_login_shown_${lineId}`,
      new Date().toDateString()
    );
  };

  useEffect(() => {
    if (lineId) {
      checkStatus();
    }
  }, [lineId]);

  return {
    showDialog,
    isLoading,
    isClaiming,
    status,
    handleClaim,
    handleClose,
    checkStatus,
  };
};
