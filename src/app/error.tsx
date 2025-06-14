"use client";

import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">เกิดข้อผิดพลาด</h1>
            <p className="mt-2">กรุณาลองใหม่อีกครั้ง</p>
          </div>
        </div>
      </body>
    </html>
  );
}
