# Toast Notifications ไม่แสดงใน Next.js 13+

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
