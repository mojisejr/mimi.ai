import { useState, useEffect } from "react";
import { imageCacheService } from "@/services/image-cache";

export const useImageCache = (cardId: string, imageUrl: string) => {
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // ตรวจสอบว่ามี cache หรือไม่
        const cached = await imageCacheService.getCachedImage(cardId);

        if (cached) {
          setCachedImageUrl(cached);
          setIsLoading(false);
          return;
        }

        // ถ้าไม่มี cache ให้โหลดและ cache ใหม่
        await imageCacheService.cacheImage(cardId, imageUrl);
        const newCached = await imageCacheService.getCachedImage(cardId);
        setCachedImageUrl(newCached);
      } catch (error) {
        console.error("Error loading cached image:", error);
        setCachedImageUrl(imageUrl); // ถ้าเกิด error ให้ใช้ URL ตรงๆ
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    // Cleanup function to revoke object URLs
    return () => {
      if (cachedImageUrl && cachedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(cachedImageUrl);
      }
    };
  }, [cardId, imageUrl]);

  return {
    imageUrl: cachedImageUrl || imageUrl,
    isLoading,
  };
};
