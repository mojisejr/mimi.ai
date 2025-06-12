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
