# Global Error Handling

ระบบจัดการ error แบบ global สำหรับ Next.js 14 ที่ใช้ App Router โดยใช้ react-toastify สำหรับแสดง notifications และ DaisyUI สำหรับ styling

## โครงสร้างไฟล์

```
src/
├── services/
│   └── toast-service.ts      # จัดการ toast notifications
├── lib/
│   └── errors/
│       └── custom-error.ts   # Custom error classes
├── contexts/
│   └── error-context.tsx     # Error context provider
├── components/
│   └── error-boundary.tsx    # Error boundary component
├── app/
│   └── error.tsx            # Global error page
└── middleware/
    └── error-handler.ts     # Error handler middleware
```

## การติดตั้ง

1. ติดตั้ง dependencies:

```bash
npm install react-toastify
# หรือ
yarn add react-toastify
```

2. สร้าง Toast Provider Component:

```tsx
// src/components/ui/toast-container.tsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
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

3. เพิ่ม Toast Provider ใน root layout:

```tsx
// src/app/layout.tsx
import ToastProvider from "@/components/ui/toast-container";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
```

## การใช้งาน

### 1. Toast Service

ใช้สำหรับแสดง notifications ทั่วทั้งแอพ

```typescript
import { toastService } from "@/services/toast-service";

// แสดง success message
toastService.success("บันทึกข้อมูลสำเร็จ");

// แสดง error message
toastService.error("เกิดข้อผิดพลาด");

// แสดง warning message
toastService.warning("กรุณาตรวจสอบข้อมูล");

// แสดง info message
toastService.info("กำลังประมวลผล");

// ปิด toast ทั้งหมด
toastService.dismiss();
```

### 2. Custom Error Classes

ใช้สำหรับสร้าง error types ที่เฉพาะเจาะจง

```typescript
import { ValidationError, APIError } from "@/lib/errors/custom-error";

// สร้าง validation error
throw new ValidationError("กรุณากรอกข้อมูลให้ครบถ้วน");

// สร้าง API error
throw new APIError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", 500);
```

### 3. Error Context

ใช้สำหรับจัดการ error state แบบ global

```typescript
// src/app/layout.tsx
import { ErrorProvider } from "@/contexts/error-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorProvider>{children}</ErrorProvider>;
}

// ใน component
import { useError } from "@/contexts/error-context";

function MyComponent() {
  const { handleError, showError, showSuccess } = useError();

  const handleSubmit = async () => {
    try {
      // ทำการบันทึกข้อมูล
      showSuccess("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      handleError(error);
    }
  };

  return <button onClick={handleSubmit}>บันทึก</button>;
}
```

### 4. Error Boundary

ใช้สำหรับจัดการ error ที่เกิดขึ้นใน client-side

```typescript
import { ErrorBoundary } from "@/components/error-boundary";

export default function Page() {
  return <ErrorBoundary>{/* Your component content */}</ErrorBoundary>;
}

// หรือใช้กับ fallback component
<ErrorBoundary
  fallback={
    <div className="text-center">
      <h2>เกิดข้อผิดพลาด</h2>
      <button onClick={() => window.location.reload()}>ลองใหม่</button>
    </div>
  }
>
  {/* Your component content */}
</ErrorBoundary>;
```

### 5. Global Error Page

ใช้สำหรับจัดการ error ที่เกิดขึ้นใน server-side

```typescript
// src/app/error.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { toastService } from "@/services/toast-service";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toastService.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-error mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4">เกิดข้อผิดพลาด</h2>
        <p className="text-gray-600 mb-8">
          {error.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง"}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => reset()} className="btn btn-primary">
            ลองใหม่
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-outline"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

### 6. Error Handler Middleware

ใช้สำหรับจัดการ error ในระดับ middleware

```typescript
// src/middleware/error-handler.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CustomError } from "@/lib/errors/custom-error";

export function errorHandler(error: Error | CustomError) {
  console.error("Error:", error);

  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
        data: error.data,
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
}

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };
}

// การใช้งานใน API route
import { withErrorHandler } from "@/middleware/error-handler";

export const GET = withErrorHandler(async (req) => {
  // Your API logic
});
```

## Best Practices

1. ใช้ `toastService` แทนการใช้ `toast` โดยตรง เพื่อความสอดคล้องกันทั้งระบบ
2. ใช้ `ErrorBoundary` ในส่วนที่ต้องการจัดการ error เฉพาะ
3. ใช้ `useError` hook สำหรับจัดการ error ใน client components
4. ใช้ custom error classes เพื่อแยกประเภท error ให้ชัดเจน
5. ใช้ `withErrorHandler` ใน API routes เพื่อจัดการ error อย่างเป็นระบบ
6. ใช้ `error.tsx` สำหรับจัดการ error ที่เกิดขึ้นใน server-side

## การปรับแต่ง

### Toast Options

ปรับแต่ง default options ได้ที่ `src/app-config.ts`:

```typescript
export const TOAST_CONFIG = {
  autoClose: 3000,
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
} as const;

export const APP_CONFIG = {
  toast: TOAST_CONFIG,
} as const;
```

### Error Messages

ปรับแต่ง error messages ได้ที่ `src/lib/errors/custom-error.ts`:

```typescript
export class ValidationError extends CustomError {
  constructor(message: string = "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", data?: any) {
    super(message, "VALIDATION_ERROR", 400, data);
  }
}
```

## การทดสอบ

1. ทดสอบ error handling ใน client-side:

```typescript
// ใน component
const { handleError } = useError();
handleError(new Error("Test error"));
```

2. ทดสอบ error handling ใน server-side:

```typescript
// ใน API route
throw new APIError("Test API error", 500);
```

3. ทดสอบ error boundary:

```typescript
// ใน component ที่มี error
throw new Error("Test boundary error");
```
