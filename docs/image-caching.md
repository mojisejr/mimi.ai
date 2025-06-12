# ระบบ Image Caching สำหรับไพ่ทาโรต์

## ภาพรวม

ระบบนี้ถูกออกแบบมาเพื่อเพิ่มประสิทธิภาพในการโหลดรูปภาพไพ่ทาโรต์ โดยใช้ IndexedDB ในการเก็บ cache รูปภาพ ซึ่งช่วยให้:

- โหลดรูปภาพเร็วขึ้น
- ลดการใช้ bandwidth
- ทำงานได้แม้ไม่มี internet (ถ้ามี cache)
- สามารถเก็บรูปภาพได้จำนวนมาก (78 ใบ)

## โครงสร้างไฟล์

```
src/
├── services/
│   └── image-cache.ts      # Service สำหรับจัดการ cache
├── hooks/
│   └── use-image-cache.ts  # Hook สำหรับใช้งาน cache
└── components/
    ├── answer-card.tsx     # Component แสดงไพ่เดี่ยว
    └── stacked-cards.tsx   # Component แสดงไพ่ซ้อนกัน
```

## ขั้นตอนการทำงาน

### 1. สร้าง Image Cache Service

```typescript
// src/services/image-cache.ts

// กำหนดค่าคงที่สำหรับการจัดการ IndexedDB
const DB_NAME = "tarot_cards_cache"; // ชื่อฐานข้อมูล
const STORE_NAME = "card_images"; // ชื่อ store สำหรับเก็บรูปภาพ
const DB_VERSION = 1; // เวอร์ชันของฐานข้อมูล (ใช้สำหรับการ upgrade)

class ImageCacheService {
  // เก็บ instance ของ IndexedDB
  private db: IDBDatabase | null = null;

  // ฟังก์ชันเริ่มต้น IndexedDB
  async initDB(): Promise<IDBDatabase> {
    // ถ้ามี db instance อยู่แล้ว ให้ใช้ instance เดิม
    if (this.db) return this.db;

    // สร้าง Promise สำหรับการเปิดฐานข้อมูล
    return new Promise((resolve, reject) => {
      // เปิดฐานข้อมูล (ถ้ายังไม่มีจะสร้างใหม่)
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // จัดการกรณีเกิด error
      request.onerror = () => reject(request.error);

      // จัดการเมื่อเปิดฐานข้อมูลสำเร็จ
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      // จัดการเมื่อต้อง upgrade ฐานข้อมูล
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // สร้าง object store ถ้ายังไม่มี
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  // ฟังก์ชันเก็บรูปภาพลง cache
  async cacheImage(cardId: string, imageUrl: string): Promise<void> {
    try {
      // เริ่มต้นฐานข้อมูล
      const db = await this.initDB();
      // ดึงรูปภาพจาก URL
      const response = await fetch(imageUrl);
      // แปลงเป็น Blob
      const blob = await response.blob();

      // สร้าง Promise สำหรับการบันทึกข้อมูล
      return new Promise((resolve, reject) => {
        // เริ่ม transaction แบบ readwrite
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // บันทึกข้อมูลลง store
        const request = store.put({
          id: cardId, // ID ของไพ่
          image: blob, // ข้อมูลรูปภาพ
          timestamp: Date.now(), // เวลาที่ cache
        });

        // จัดการเมื่อบันทึกสำเร็จ
        request.onsuccess = () => resolve();
        // จัดการเมื่อเกิด error
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error caching image:", error);
    }
  }

  // ฟังก์ชันดึงรูปภาพจาก cache
  async getCachedImage(cardId: string): Promise<string | null> {
    try {
      // เริ่มต้นฐานข้อมูล
      const db = await this.initDB();

      // สร้าง Promise สำหรับการดึงข้อมูล
      return new Promise((resolve, reject) => {
        // เริ่ม transaction แบบ readonly
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        // ดึงข้อมูลจาก store
        const request = store.get(cardId);

        // จัดการเมื่อดึงข้อมูลสำเร็จ
        request.onsuccess = () => {
          if (request.result) {
            // ถ้ามีข้อมูลใน cache
            const blob = request.result.image;
            // สร้าง URL สำหรับแสดงรูปภาพ
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            // ถ้าไม่มีข้อมูลใน cache
            resolve(null);
          }
        };

        // จัดการเมื่อเกิด error
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error getting cached image:", error);
      return null;
    }
  }
}

// สร้าง instance เดียวของ service
export const imageCacheService = new ImageCacheService();
```

### 2. สร้าง Custom Hook

```typescript
// src/hooks/use-image-cache.ts
import { useState, useEffect } from "react";
import { imageCacheService } from "@/services/image-cache";

// Hook สำหรับจัดการการ cache รูปภาพ
export const useImageCache = (cardId: string, imageUrl: string) => {
  // state สำหรับเก็บ URL ของรูปภาพที่ cache แล้ว
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  // state สำหรับเก็บสถานะการโหลด
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันสำหรับโหลดรูปภาพ
    const loadImage = async () => {
      try {
        // ตรวจสอบว่ามีรูปใน cache หรือไม่
        const cached = await imageCacheService.getCachedImage(cardId);

        if (cached) {
          // ถ้ามีใน cache ให้ใช้รูปจาก cache
          setCachedImageUrl(cached);
          setIsLoading(false);
          return;
        }

        // ถ้าไม่มีใน cache ให้โหลดและ cache ใหม่
        await imageCacheService.cacheImage(cardId, imageUrl);
        const newCached = await imageCacheService.getCachedImage(cardId);
        setCachedImageUrl(newCached);
      } catch (error) {
        // กรณีเกิด error ให้ใช้รูปจาก URL โดยตรง
        console.error("Error loading cached image:", error);
        setCachedImageUrl(imageUrl);
      } finally {
        // ปิดสถานะ loading ไม่ว่าจะสำเร็จหรือไม่
        setIsLoading(false);
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
```

### 3. ใช้งานใน Component

```typescript
// src/components/answer-card.tsx
export default function AnswerCard({ name, image, flipped, onClick }: Props) {
  // ใช้ hook สำหรับจัดการ cache
  const { imageUrl, isLoading } = useImageCache(name, image);

  return (
    <motion.div>
      {/* ด้านหน้าของไพ่ */}
      <motion.div>
        {/* แสดงรูปภาพไพ่ */}
        <Image src={imageUrl} alt={name} fill className="object-contain" />
      </motion.div>

      {/* ด้านหลังของไพ่ */}
      <motion.div>
        {/* แสดง loading animation ระหว่างโหลดรูป */}
        {isLoading && <div className="loading loading-infinity" />}
      </motion.div>
    </motion.div>
  );
}
```

## วิธีการทำงาน

1. เมื่อ user เห็นไพ่ครั้งแรก:

   - ระบบจะโหลดรูปภาพจาก URL
   - แปลงรูปเป็น Blob
   - เก็บลง IndexedDB
   - สร้าง Object URL สำหรับแสดงรูป

2. ครั้งต่อไปที่เห็นไพ่ใบเดิม:

   - ระบบจะดึงรูปจาก IndexedDB
   - สร้าง Object URL ใหม่
   - แสดงรูปทันทีโดยไม่ต้องโหลดใหม่

3. เมื่อ component unmount:
   - ระบบจะ revoke Object URL
   - ป้องกัน memory leak

## ข้อดีของระบบ

1. ใช้ IndexedDB แทน localStorage:

   - เก็บข้อมูลได้มากกว่า
   - เหมาะกับข้อมูลขนาดใหญ่
   - มีประสิทธิภาพดีกว่า

2. เก็บรูปในรูปแบบ Blob:

   - ใช้พื้นที่น้อยกว่า base64
   - ประมวลผลเร็วขึ้น
   - เหมาะกับการแสดงรูปภาพ

3. มี loading state:

   - แสดงระหว่างโหลดรูป
   - UX ดีขึ้น
   - ผู้ใช้รู้ว่าระบบกำลังทำงาน

4. จัดการ memory:
   - revoke URLs เมื่อไม่ใช้
   - ป้องกัน memory leak
   - ระบบเสถียรขึ้น

## การทดสอบ

1. เปิดแอพครั้งแรก:

   - ดู loading state
   - ตรวจสอบการ cache
   - วัดความเร็วในการโหลด

2. เปิดแอพครั้งต่อไป:

   - ตรวจสอบความเร็วในการโหลด
   - ดูว่ามีการใช้ cache หรือไม่
   - ตรวจสอบ IndexedDB

3. ทดสอบ offline:
   - ปิด internet
   - ตรวจสอบว่ายังแสดงรูปได้
   - วัดความเร็วในการโหลด

## ข้อควรระวัง

1. ตรวจสอบ browser support:

   - IndexedDB อาจไม่รองรับในบาง browser
   - ควรมี fallback mechanism

2. จัดการ error:

   - กรณี IndexedDB ไม่สามารถใช้งานได้
   - กรณีโหลดรูปไม่สำเร็จ
   - กรณี quota เต็ม

3. ดูแล memory:
   - revoke URLs ทุกครั้ง
   - ตรวจสอบ memory usage
   - ทำ cleanup ให้ถูกต้อง
