# เอกสารการแก้ไขปัญหา (Troubleshooting Documentation)

## Toast Notifications ไม่แสดงใน Next.js 13+

### ปัญหาที่เกิดขึ้น

เมื่อใช้ react-toastify ใน Next.js 13+ โดยวาง `ToastContainer` ไว้ใน root layout (`app/layout.tsx`) โดยตรง toast notifications ไม่แสดงผล เนื่องจาก root layout เป็น server component แต่ `ToastContainer` ต้องการ client-side features

### สิ่งที่เราพยายามแก้ไข

1. วาง `ToastContainer` ใน root layout โดยตรง
2. วาง `ToastContainer` ในแต่ละ page component
3. ใช้ "use client" directive ใน root layout (ไม่สามารถทำได้)

### วิธีแก้ไข

1. สร้าง client component แยกต่างหากสำหรับ `ToastContainer`:

```typescript
// src/components/ui/toast-container.tsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
```

2. ใช้ `ToastProvider` ใน root layout:

```typescript
// src/app/layout.tsx
import ToastProvider from "@/components/ui/toast-container";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
```

3. ใช้งาน toast ใน client components:

```typescript
// src/app/(user)/swap/page.tsx
"use client";
import { toast } from "react-toastify";

export default function SwapPage() {
  const handleSwap = async () => {
    try {
      // ... your code ...
      toast.success("แลกเหรียญสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };
}
```

### ข้อดีของการแก้ไขนี้

1. แยก client-side logic ออกมาเป็น component แยกต่างหาก
2. ใช้ "use client" directive อย่างถูกต้อง
3. สามารถใช้ toast ได้ทั่วทั้งแอพ
4. ลดการโหลด `ToastContainer` ซ้ำซ้อน
5. เป็นไปตาม best practices ของ Next.js 13+

## การใช้งาน useTransition กับ Server Actions ใน Next.js 15

### ปัญหาที่เกิดขึ้น

เมื่อต้องการเรียกใช้ server action จาก client component โดยตรง อาจทำให้เกิดปัญหา:

1. UI ไม่มีการแสดงสถานะ loading
2. ไม่สามารถยกเลิกการทำงานได้
3. ไม่มีการจัดการ error ที่เหมาะสม

### วิธีแก้ไข

1. สร้าง server action:

```typescript
// src/actions/swap.ts
"use server";

import { revalidatePath } from "next/cache";

export async function swapCoins(amount: number) {
  try {
    // ... your server-side logic ...
    revalidatePath("/swap");
    return { success: true };
  } catch (error) {
    return { success: false, error: "เกิดข้อผิดพลาด" };
  }
}
```

2. ใช้งานใน client component ด้วย useTransition:

```typescript
// src/app/(user)/swap/page.tsx
"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { swapCoins } from "@/actions/swap";

export default function SwapPage() {
  const [isPending, startTransition] = useTransition();

  const handleSwap = async () => {
    // เริ่มการทำงานแบบ transition
    startTransition(async () => {
      try {
        const result = await swapCoins(100);

        if (result.success) {
          toast.success("แลกเหรียญสำเร็จ");
        } else {
          toast.error(result.error || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการแลกเหรียญ");
      }
    });
  };

  return (
    <div>
      <button onClick={handleSwap} disabled={isPending}>
        {isPending ? "กำลังแลกเหรียญ..." : "แลกเหรียญ"}
      </button>
    </div>
  );
}
```

### ข้อดีของการใช้ useTransition

1. **การจัดการ UI State**:

   - สามารถแสดงสถานะ loading ได้
   - ป้องกันการกดปุ่มซ้ำระหว่างการทำงาน
   - UI ยังคงตอบสนองได้ระหว่างการทำงาน

2. **การจัดการ Error**:

   - สามารถจัดการ error ได้อย่างเหมาะสม
   - แสดงข้อความแจ้งเตือนที่เหมาะสมกับผู้ใช้

3. **Performance**:

   - ลดการ re-render ที่ไม่จำเป็น
   - ปรับปรุง user experience
   - เป็นไปตาม best practices ของ Next.js 15

4. **การยกเลิกการทำงาน**:
   - สามารถยกเลิกการทำงานได้หากจำเป็น
   - ป้องกันการทำงานซ้ำซ้อน

### ข้อควรระวัง

1. ควรใช้ `useTransition` เฉพาะกับ server actions ที่ใช้เวลานาน
2. ควรจัดการ error ให้ครอบคลุมทุกกรณี
3. ควรแสดง feedback ให้ผู้ใช้ทราบสถานะการทำงาน
4. ควรใช้ `revalidatePath` หรือ `revalidateTag` เพื่อ refresh ข้อมูลที่เกี่ยวข้อง

# การออกแบบและวิธีการคำนวณ Progress ของ EXP

## วัตถุประสงค์

`calculateProgress` function ถูกออกแบบมาเพื่อคำนวณความคืบหน้าของ EXP ในแต่ละเลเวล โดยแสดงผลเป็นเปอร์เซ็นต์ (0-100%)

## พารามิเตอร์ที่รับเข้ามา

1. `exp` (number): EXP ปัจจุบันที่ผู้เล่นมี
2. `nextExpRequired` (number): EXP ที่ต้องใช้เพื่อไปถึงเลเวลถัดไป
3. `nextExpTotal` (number): EXP สูงสุดที่ต้องไปให้ถึงในเลเวลปัจจุบัน

## วิธีการคำนวณ

1. คำนวณ EXP ที่เหลือต้องใช้เพื่อไปถึงเลเวลถัดไป:

   ```typescript
   const remainingExp = nextExpTotal - exp;
   ```

2. คำนวณ EXP ทั้งหมดที่ต้องใช้ในเลเวลนี้:

   ```typescript
   const totalExpForLevel = nextExpTotal - (nextExpTotal - nextExpRequired);
   ```

3. คำนวณเปอร์เซ็นต์ความคืบหน้า:

   ```typescript
   const progress =
     ((totalExpForLevel - remainingExp) / totalExpForLevel) * 100;
   ```

4. ตรวจสอบค่าให้อยู่ระหว่าง 0-100:
   ```typescript
   return Math.min(Math.max(progress, 0), 100);
   ```

## ตัวอย่างการคำนวณ

### ตัวอย่างที่ 1: เริ่มต้นเลเวล

- exp = 300
- nextExpRequired = 300
- nextExpTotal = 500
- ผลลัพธ์: 33.33%

การคำนวณ:

1. remainingExp = 500 - 300 = 200
2. totalExpForLevel = 500 - (500 - 300) = 300
3. progress = ((300 - 200) / 300) \* 100 = 33.33%

### ตัวอย่างที่ 2: กลางเลเวล

- exp = 400
- nextExpRequired = 300
- nextExpTotal = 500
- ผลลัพธ์: 66.67%

การคำนวณ:

1. remainingExp = 500 - 400 = 100
2. totalExpForLevel = 500 - (500 - 300) = 300
3. progress = ((300 - 100) / 300) \* 100 = 66.67%

### ตัวอย่างที่ 3: จบเลเวล

- exp = 500
- nextExpRequired = 300
- nextExpTotal = 500
- ผลลัพธ์: 100%

การคำนวณ:

1. remainingExp = 500 - 500 = 0
2. totalExpForLevel = 500 - (500 - 300) = 300
3. progress = ((300 - 0) / 300) \* 100 = 100%

## การใช้งาน

```typescript
const progress = calculateProgress(
  user.exp,
  user.nextExpRequired,
  user.nextExpTotal
);
```

## ข้อควรระวัง

1. ค่าที่ส่งเข้ามาต้องเป็นตัวเลขเท่านั้น
2. nextExpTotal ต้องมากกว่า nextExpRequired เสมอ
3. exp ควรอยู่ระหว่าง nextExpRequired ถึง nextExpTotal
4. ผลลัพธ์จะถูกจำกัดให้อยู่ระหว่าง 0-100 เสมอ

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

# การจัดการ Image Caching ใน Next.js

## ภาพรวม

ระบบ Image Caching ถูกออกแบบมาเพื่อเพิ่มประสิทธิภาพในการโหลดรูปภาพในแอพพลิเคชัน โดยใช้ IndexedDB ในการเก็บ cache รูปภาพ ซึ่งช่วยให้:

- โหลดรูปภาพเร็วขึ้น
- ลดการใช้ bandwidth
- ทำงานได้แม้ไม่มี internet (ถ้ามี cache)
- สามารถเก็บรูปภาพได้จำนวนมาก

## โครงสร้างไฟล์

```
src/
├── services/
│   └── image-cache.ts      # Service สำหรับจัดการ cache
└── hooks/
    └── use-image-cache.ts  # Hook สำหรับใช้งาน cache
```

## การใช้งาน

### 1. การใช้งานใน Component

```typescript
// src/components/your-component.tsx
import { useImageCache } from "@/hooks/use-image-cache";

export default function YourComponent() {
  const { imageUrl, isLoading } = useImageCache(
    "unique-id", // ID ที่ใช้ระบุรูปภาพ
    "https://example.com/image.jpg" // URL ของรูปภาพ
  );

  return (
    <div>
      {isLoading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <img src={imageUrl} alt="Your image" />
      )}
    </div>
  );
}
```

### 2. การจัดการ Cache

```typescript
// src/services/image-cache.ts
import { imageCacheService } from "@/services/image-cache";

// เก็บรูปภาพลง cache
await imageCacheService.cacheImage(
  "unique-id",
  "https://example.com/image.jpg"
);

// ดึงรูปภาพจาก cache
const cachedImage = await imageCacheService.getCachedImage("unique-id");
```

## ข้อดีของระบบ

1. **ประสิทธิภาพ**:

   - โหลดรูปภาพเร็วขึ้น
   - ลดการใช้ bandwidth
   - ทำงานได้แม้ไม่มี internet

2. **การจัดการ Memory**:

   - ใช้ IndexedDB แทน localStorage
   - เก็บข้อมูลได้มากกว่า
   - มีประสิทธิภาพดีกว่า

3. **User Experience**:
   - แสดง loading state
   - โหลดรูปภาพเร็วขึ้น
   - ทำงานได้แม้ไม่มี internet

## ข้อควรระวัง

1. **Browser Support**:

   - ตรวจสอบการรองรับ IndexedDB
   - มี fallback mechanism

2. **Error Handling**:

   - จัดการกรณี IndexedDB ไม่สามารถใช้งานได้
   - จัดการกรณีโหลดรูปไม่สำเร็จ
   - จัดการกรณี quota เต็ม

3. **Memory Management**:
   - revoke URLs เมื่อไม่ใช้
   - ตรวจสอบ memory usage
   - ทำ cleanup ให้ถูกต้อง

## การทดสอบ

1. **การโหลดครั้งแรก**:

   - ตรวจสอบ loading state
   - ตรวจสอบการ cache
   - วัดความเร็วในการโหลด

2. **การโหลดครั้งต่อไป**:

   - ตรวจสอบความเร็วในการโหลด
   - ตรวจสอบการใช้ cache
   - ตรวจสอบ IndexedDB

3. **การทดสอบ Offline**:
   - ตรวจสอบการทำงานเมื่อไม่มี internet
   - ตรวจสอบการแสดงรูปภาพ
   - วัดความเร็วในการโหลด
