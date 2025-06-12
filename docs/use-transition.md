# การใช้งาน useTransition กับ Server Actions ใน Next.js 15

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
