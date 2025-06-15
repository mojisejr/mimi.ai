# คู่มือการตั้งค่า Sentry ใน Next.js

## สารบัญ

1. [Sentry คืออะไร](#sentry-คืออะไร)
2. [หลักการทำงานของ Sentry](#หลักการทำงานของ-sentry)
3. [การเตรียมการ](#การเตรียมการ)
4. [การติดตั้ง Sentry](#การติดตั้ง-sentry)
5. [การตั้งค่า Sentry](#การตั้งค่า-sentry)
6. [การทดสอบการทำงาน](#การทดสอบการทำงาน)
7. [การตั้งค่าเพิ่มเติม](#การตั้งค่าเพิ่มเติม)

## Sentry คืออะไร

Sentry เป็นเครื่องมือสำหรับการติดตามและรายงานข้อผิดพลาด (Error Tracking) ที่เกิดขึ้นในแอปพลิเคชัน โดยมีคุณสมบัติหลักๆ ดังนี้:

1. **การติดตามข้อผิดพลาดแบบ Real-time**

   - แจ้งเตือนทันทีเมื่อเกิดข้อผิดพลาด
   - แสดงรายละเอียดของข้อผิดพลาด เช่น stack trace, context, user data
   - จัดกลุ่มข้อผิดพลาดที่คล้ายกัน

2. **Performance Monitoring**

   - วัดประสิทธิภาพของแอปพลิเคชัน
   - วิเคราะห์ bottlenecks
   - ติดตาม response time

3. **Session Replay**

   - บันทึกการทำงานของผู้ใช้
   - ดูว่าผู้ใช้ทำอะไรก่อนเกิดข้อผิดพลาด
   - ช่วยในการ debug

4. **Release Tracking**
   - ติดตามการ deploy เวอร์ชันใหม่
   - เปรียบเทียบข้อผิดพลาดระหว่างเวอร์ชัน
   - ระบุว่าเวอร์ชันไหนมีปัญหามากที่สุด

## หลักการทำงานของ Sentry

### 1. การส่งข้อมูลไปยัง Sentry

Sentry ทำงานผ่าน SDK (Software Development Kit) ที่ติดตั้งในแอปพลิเคชัน โดยมีขั้นตอนการทำงานดังนี้:

1. **การ Capture Events**

   ```typescript
   // จับข้อผิดพลาด
   try {
     // code ที่อาจเกิดข้อผิดพลาด
   } catch (error) {
     Sentry.captureException(error);
   }

   // จับข้อความ
   Sentry.captureMessage("Something went wrong");

   // จับ performance
   const transaction = Sentry.startTransaction({
     name: "Important Operation",
   });
   ```

2. **การส่งข้อมูล**
   - ข้อมูลจะถูกส่งไปยัง Sentry server ผ่าน DSN (Data Source Name)
   - สามารถส่งผ่าน Next.js server เพื่อหลีกเลี่ยง ad blockers
   - ข้อมูลจะถูกบีบอัดและเข้ารหัสก่อนส่ง

### 2. การประมวลผลข้อมูล

เมื่อ Sentry ได้รับข้อมูล จะมีการประมวลผลดังนี้:

1. **การจัดกลุ่ม (Grouping)**

   - ข้อผิดพลาดที่คล้ายกันจะถูกรวมเป็นกลุ่ม
   - ใช้ stack trace และ context ในการจัดกลุ่ม
   - ช่วยลดการแจ้งเตือนซ้ำ

2. **การวิเคราะห์ (Analysis)**

   - วิเคราะห์ความรุนแรงของข้อผิดพลาด
   - ระบุสาเหตุที่เป็นไปได้
   - แนะนำวิธีแก้ไข

3. **การแจ้งเตือน (Alerting)**
   - ส่งการแจ้งเตือนผ่านช่องทางต่างๆ (email, Slack, etc.)
   - ตั้งค่าเงื่อนไขการแจ้งเตือนได้
   - แยกประเภทการแจ้งเตือนตามความสำคัญ

### 3. การแสดงผลใน Dashboard

Sentry มี dashboard ที่แสดงข้อมูลต่างๆ:

1. **Issues**

   - รายการข้อผิดพลาดทั้งหมด
   - สถานะและความรุนแรง
   - จำนวนครั้งที่เกิดขึ้น

2. **Performance**

   - กราฟแสดงประสิทธิภาพ
   - การวิเคราะห์ bottlenecks
   - การเปรียบเทียบระหว่างเวอร์ชัน

3. **Releases**
   - ประวัติการ deploy
   - ข้อผิดพลาดในแต่ละเวอร์ชัน
   - การเปรียบเทียบ metrics

### 4. การ Integrate กับระบบอื่นๆ

Sentry สามารถทำงานร่วมกับเครื่องมืออื่นๆ ได้:

1. **Version Control**

   - เชื่อมต่อกับ Git repositories
   - แสดง commit ที่เกี่ยวข้องกับข้อผิดพลาด
   - สร้าง issues อัตโนมัติ

2. **CI/CD**

   - เชื่อมต่อกับระบบ CI/CD
   - ตรวจสอบคุณภาพก่อน deploy
   - แจ้งเตือนเมื่อ deploy สำเร็จ/ล้มเหลว

3. **Project Management**
   - เชื่อมต่อกับ Jira, GitHub Issues
   - สร้าง tickets อัตโนมัติ
   - อัพเดทสถานะการแก้ไข

## การเตรียมการ

1. สร้างบัญชี Sentry ที่ [sentry.io](https://sentry.io)
2. สร้างโปรเจคใหม่ใน Sentry และเลือก Next.js เป็น platform
3. เก็บ DSN (Data Source Name) ไว้ใช้ในการตั้งค่า

## การติดตั้ง Sentry

1. ติดตั้ง Sentry CLI และ Next.js SDK:

```bash
npm install --save @sentry/nextjs
```

2. รัน Sentry Wizard เพื่อตั้งค่าเริ่มต้น:

```bash
npx @sentry/wizard@latest -i nextjs
```

Wizard จะสร้างไฟล์ต่อไปนี้:

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `next.config.js` (หรือแก้ไขไฟล์ที่มีอยู่)
- `.env.sentry-build-plugin`

## การตั้งค่า Sentry

### 1. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มค่าต่อไปนี้:

```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_AUTH_TOKEN=authtoken
```

### 2. ตั้งค่า Next.js Config

แก้ไขไฟล์ `next.config.js`:

```javascript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // your existing config
};

export default withSentryConfig(nextConfig, {
  // Sentry config
  org: "your-org-name",
  project: "your-project-name",

  // ตั้งค่า source maps
  widenClientFileUpload: true,

  // ตั้งค่า tunnel route เพื่อหลีกเลี่ยง ad blockers
  tunnelRoute: "/monitoring",

  // ปิดการใช้งาน logger เพื่อลดขนาด bundle
  disableLogger: true,

  // เปิดใช้งาน Vercel Cron Monitors
  automaticVercelMonitors: true,
});
```

### 3. ตั้งค่า Error Boundary

สร้างไฟล์ `src/app/error.tsx`:

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
```

### 4. ตั้งค่า Instrumentation

สร้างไฟล์ `src/instrumentation.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

## การทดสอบการทำงาน

1. สร้าง API route สำหรับทดสอบ:

```typescript
// src/app/api/sentry-example-api/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

export function GET() {
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page."
  );
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
```

2. ทดสอบการทำงาน:
   - รันแอปพลิเคชันในโหมด development
   - เข้าถึง API route ที่สร้างขึ้น
   - ตรวจสอบ Sentry dashboard ว่ามีการรายงาน error หรือไม่

## การตั้งค่าเพิ่มเติม

### การตั้งค่า Performance Monitoring

ใน `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ตั้งค่า performance monitoring
  tracesSampleRate: 1.0,

  // ตั้งค่า Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // เพิ่ม integrations
  integrations: [Sentry.replayIntegration()],
});
```

### การตั้งค่า Source Maps

1. เพิ่ม script ใน `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "sentry-cli sourcemaps inject .next && sentry-cli sourcemaps upload .next"
  }
}
```

2. สร้างไฟล์ `.sentryclirc`:

```ini
[auth]
token=your-auth-token

[defaults]
org=your-org-name
project=your-project-name
```

## ข้อควรระวัง

1. อย่าลืมเพิ่ม `.env.sentry-build-plugin` ใน `.gitignore`
2. ตรวจสอบให้แน่ใจว่า DSN ถูกต้องและปลอดภัย
3. ตั้งค่า `tracesSampleRate` ให้เหมาะสมกับ production environment
4. ตรวจสอบว่า tunnel route ไม่ขัดแย้งกับ middleware ที่มีอยู่

## การแก้ไขปัญหา

1. ถ้าไม่เห็น error ใน Sentry dashboard:

   - ตรวจสอบ DSN
   - ตรวจสอบ network requests
   - ตรวจสอบ console logs

2. ถ้า source maps ไม่ทำงาน:
   - ตรวจสอบ auth token
   - ตรวจสอบ build process
   - ตรวจสอบ file permissions

## อ้างอิง

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry SDK Documentation](https://docs.sentry.io/platforms/javascript/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
