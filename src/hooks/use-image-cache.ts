import { useState, useEffect } from "react";
import { imageCacheService } from "@/services/image-cache";

// Hook สำหรับจัดการการ cache รูปภาพ
export const useImageCache = (cardId: string, imageUrl: string) => {
  // state สำหรับเก็บ URL ของรูปภาพที่ cache แล้ว
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  // state สำหรับเก็บสถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ฟังก์ชันสำหรับโหลดรูปภาพ
    const loadImage = async () => {
      try {
        // ตรวจสอบว่ามีรูปใน cache หรือไม่
        const cached = await imageCacheService.getCachedImage(cardId);

        if (cached) {
          // ถ้ามีใน cache ให้ใช้รูปจาก cache
          setCachedImageUrl(cached);
          return;
        }

        // ถ้าไม่มีใน cache ให้ใช้ URL โดยตรงก่อน
        setCachedImageUrl(imageUrl);

        // แล้วค่อย cache ในพื้นหลัง
        try {
          await imageCacheService.cacheImage(cardId, imageUrl);
          const newCached = await imageCacheService.getCachedImage(cardId);
          if (newCached) {
            setCachedImageUrl(newCached);
          }
        } catch (error) {
          console.error("Error caching image in background:", error);
          // ถ้า cache ไม่สำเร็จก็ไม่เป็นไร เพราะเรามีรูปจาก URL อยู่แล้ว
        }
      } catch (error) {
        // กรณีเกิด error ให้ใช้รูปจาก URL โดยตรง
        console.error("Error loading cached image:", error);
        setCachedImageUrl(imageUrl);
      }
    };

    // เริ่มโหลดรูปภาพ
    loadImage();

    // Cleanup function
    return () => {
      // ลบ Object URL เมื่อ component unmount
      if (cachedImageUrl && cachedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(cachedImageUrl);
      }
    };
  }, [cardId, imageUrl]); // ทำงานใหม่เมื่อ cardId หรือ imageUrl เปลี่ยน

  // ส่งคืน URL ของรูปภาพและสถานะการโหลด
  return {
    imageUrl: cachedImageUrl || imageUrl, // ใช้รูปจาก cache หรือ URL โดยตรง
    isLoading, // สถานะการโหลด
  };
};
