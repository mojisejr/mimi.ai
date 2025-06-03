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
