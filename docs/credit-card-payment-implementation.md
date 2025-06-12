# การ Implement Credit Card Payment ด้วย Omise

## Table of Contents

1. [การเตรียมการ](#การเตรียมการ)
2. [การติดตั้ง Dependencies](#การติดตั้ง-dependencies)
3. [การ Setup Omise](#การ-setup-omise)
4. [การสร้าง API Routes](#การสร้าง-api-routes)
5. [การสร้าง Custom Hooks](#การสร้าง-custom-hooks)
6. [การสร้าง UI Components](#การสร้าง-ui-components)
7. [การจัดการ State และ Flow](#การจัดการ-state-และ-flow)
8. [การทดสอบ](#การทดสอบ)

## การเตรียมการ

### 1. สร้างบัญชี Omise

1. ลงทะเบียนที่ [Omise Dashboard](https://dashboard.omise.co/register)
2. เปิดใช้งาน Test Mode
3. เก็บ Public Key และ Secret Key ไว้ใช้

### 2. ตั้งค่า Environment Variables

```env
NEXT_PUBLIC_OMISE_PUBLIC_KEY=pkey_test_xxx
OMISE_SECRET_KEY=skey_test_xxx
```

## การติดตั้ง Dependencies

```bash
# ติดตั้ง Omise.js
yarn add omise

# ติดตั้ง dependencies สำหรับ UI
yarn add react-number-format
```

## การ Setup Omise

### 1. สร้าง Script Loader

```typescript
// src/utils/script-loader.ts
export const loadScript = (src: string): Promise<Event> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
```

### 2. ตั้งค่า Omise ใน Application

```typescript
// src/providers/omise.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { loadScript } from "@/utils/script-loader";

const OmiseContext = createContext<any>(null);

export function OmiseProvider({ children }: { children: React.ReactNode }) {
  const [omise, setOmise] = useState<any>(null);

  useEffect(() => {
    loadScript("https://cdn.omise.co/omise.js").then(() => {
      const omiseInstance = (window as any).Omise;
      omiseInstance.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!);
      setOmise(omiseInstance);
    });
  }, []);

  return (
    <OmiseContext.Provider value={omise}>{children}</OmiseContext.Provider>
  );
}

export const useOmise = () => useContext(OmiseContext);
```

## การสร้าง API Routes

### 1. สร้าง Token

```typescript
// src/app/api/omise/token/route.ts
import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const { card } = await request.json();
    const token = await omise.tokens.create({ card });
    return NextResponse.json(token);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
```

### 2. สร้าง Charge

```typescript
// src/app/api/omise/charge/route.ts
import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const { token, amount, description } = await request.json();
    const charge = await omise.charges.create({
      amount,
      currency: "thb",
      card: token,
      description,
    });
    return NextResponse.json(charge);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create charge" },
      { status: 500 }
    );
  }
}
```

## การสร้าง Custom Hooks

### 1. สร้าง Hook สำหรับจัดการ Credit Card

```typescript
// src/hooks/credit-card.ts
import { useState } from "react";
import { useOmise } from "@/providers/omise";

export const useCreditCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const omise = useOmise();

  const createToken = async (cardData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/omise/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardData }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createCharge = async (
    token: string,
    amount: number,
    description: string
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/omise/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, amount, description }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createToken,
    createCharge,
    isLoading,
  };
};
```

## การสร้าง UI Components

### 1. สร้าง Credit Card Form

```typescript
// src/components/credit-card-form.tsx
import { useState } from "react";
import { PatternFormat } from "react-number-format";
import { useCreditCard } from "@/hooks/credit-card";
import { PackageInfo } from "@/interfaces/i-package";

type Props = {
  pack: PackageInfo;
  onClose: () => void;
};

type CardState = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
};

export default function CreditCardForm({ pack, onClose }: Props) {
  const [card, setCard] = useState<CardState>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const { createToken, createCharge, isLoading } = useCreditCard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await createToken({
        number: card.number.replace(/\s/g, ""),
        name: card.name,
        expiration_month: parseInt(card.expiry.split("/")[0]),
        expiration_year: parseInt(card.expiry.split("/")[1]) + 2000,
        security_code: card.cvc,
      });

      await createCharge(
        token.id,
        pack.price * 100, // Convert to satang
        `Payment for ${pack.name}`
      );

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-box">
      <h2 className="text-2xl font-bold mb-4">Enter Card Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Card Number</label>
          <PatternFormat
            format="#### #### #### ####"
            mask="_"
            className="input input-bordered w-full"
            value={card.number}
            onValueChange={(values) =>
              setCard({ ...card, number: values.value })
            }
          />
        </div>
        <div>
          <label className="label">Name on Card</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Expiry Date</label>
            <PatternFormat
              format="##/##"
              mask="_"
              className="input input-bordered w-full"
              value={card.expiry}
              onValueChange={(values) =>
                setCard({ ...card, expiry: values.value })
              }
            />
          </div>
          <div>
            <label className="label">CVV</label>
            <PatternFormat
              format="###"
              mask="_"
              className="input input-bordered w-full"
              value={card.cvc}
              onValueChange={(values) =>
                setCard({ ...card, cvc: values.value })
              }
            />
          </div>
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

## การจัดการ State และ Flow

### 1. Flow การชำระเงิน

1. ผู้ใช้เลือกวิธีการชำระเงินเป็น Credit Card
2. ระบบแสดงฟอร์มกรอกข้อมูลบัตรเครดิต
3. ผู้ใช้กรอกข้อมูลบัตรเครดิต
4. ระบบสร้าง Token ผ่าน Omise API
5. ระบบสร้าง Charge ผ่าน Omise API
6. ระบบอัพเดทสถานะการชำระเงินในฐานข้อมูล
7. ระบบแสดงผลการชำระเงิน

### 2. การจัดการ Error

- ตรวจสอบความถูกต้องของข้อมูลบัตรเครดิต
- จัดการกรณี Token Creation Failed
- จัดการกรณี Charge Failed
- แสดง Error Message ที่เหมาะสม

## การทดสอบ

### 1. Test Cards

- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Expiry: 12/25
- CVV: 123

### 2. Test Scenarios

1. ชำระเงินสำเร็จ
2. บัตรหมดอายุ
3. ยอดเงินไม่เพียงพอ
4. CVV ไม่ถูกต้อง

### 3. Testing Tools

- Omise Test Dashboard
- Browser Developer Tools
- Network Tab สำหรับตรวจสอบ API Calls

## Best Practices

1. **Security**

   - ใช้ HTTPS เท่านั้น
   - ไม่เก็บข้อมูลบัตรเครดิตในฐานข้อมูล
   - ใช้ Token แทนข้อมูลบัตรเครดิต

2. **Error Handling**

   - แสดง Error Message ที่เข้าใจง่าย
   - Log Errors สำหรับการ Debug
   - มี Fallback Plan

3. **UX/UI**

   - แสดง Loading State
   - Validate ข้อมูลก่อน Submit
   - Format ข้อมูลให้อ่านง่าย

4. **Performance**
   - Lazy Load Omise.js
   - Optimize API Calls
   - Cache Token เมื่อจำเป็น

## Troubleshooting

### Common Issues

1. Token Creation Failed

   - ตรวจสอบ Public Key
   - ตรวจสอบข้อมูลบัตรเครดิต
   - ตรวจสอบ Network Connection

2. Charge Failed

   - ตรวจสอบ Secret Key
   - ตรวจสอบ Token
   - ตรวจสอบยอดเงิน

3. UI Issues
   - ตรวจสอบ CSS Loading
   - ตรวจสอบ Component Mounting
   - ตรวจสอบ State Management

## References

1. [Omise Documentation](https://www.omise.co/docs)
2. [Omise API Reference](https://www.omise.co/api-reference)
3. [Omise Test Cards](https://www.omise.co/test-cards)
4. [Next.js Documentation](https://nextjs.org/docs)
5. [React Number Format](https://github.com/s-yadav/react-number-format)
