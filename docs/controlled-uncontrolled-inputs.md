# Controlled vs Uncontrolled Inputs ใน React

## ภาพรวม

ใน React มีวิธีการจัดการกับ form inputs 2 แบบหลักๆ:

1. **Controlled Inputs** - React เป็นผู้ควบคุม state ของ input โดยตรง
2. **Uncontrolled Inputs** - DOM เป็นผู้ควบคุม state ของ input โดยตรง

## Controlled Inputs

### ความหมาย

Controlled Input คือ input ที่ React เป็นผู้ควบคุม state โดยตรง ผ่านการใช้ state และ event handlers

### ลักษณะสำคัญ

- มี `value` prop ที่เชื่อมโยงกับ state
- มี `onChange` handler เพื่ออัพเดท state
- React เป็นผู้ควบคุมการแสดงผลของ input

### ตัวอย่างจาก Codebase

จาก `QuestionSubmit` component:

```typescript
// 1. สร้าง state สำหรับเก็บค่า input
const [question, setQuestion] = useState<string>("");

// 2. ใช้ state เป็น value และอัพเดทผ่าน onChange
<textarea
  value={question}
  onChange={(e) => {
    setQuestion(e.target.value);
    setCount(e.target.value.length);
  }}
  // ... props อื่นๆ
/>;
```

### ข้อดี

- สามารถควบคุมและตรวจสอบค่าได้ตลอดเวลา
- ง่ายต่อการทำ form validation
- สามารถทำ conditional rendering ตามค่า input ได้
- ง่ายต่อการทำ form reset

### ข้อเสีย

- ต้องเขียนโค้ดเพิ่มเติมเพื่อจัดการ state
- อาจมีผลต่อ performance เมื่อมี input จำนวนมาก

## Uncontrolled Inputs

### ความหมาย

Uncontrolled Input คือ input ที่ DOM เป็นผู้ควบคุม state โดยตรง โดย React ไม่ได้จัดการ state ของ input

### ลักษณะสำคัญ

- ใช้ `ref` เพื่อเข้าถึงค่า input
- ไม่มี `value` prop
- DOM เป็นผู้ควบคุมการแสดงผลของ input

### ตัวอย่างจาก Codebase (ก่อนการแก้ไข)

```typescript
// 1. สร้าง ref
const inputRef = useRef<HTMLTextAreaElement>(null);

// 2. ใช้ ref เพื่อเข้าถึงค่า
<textarea
  ref={inputRef}
  onChange={(e) => {
    setCount(e.target.value.length);
  }}
  // ... props อื่นๆ
/>;

// 3. การเข้าถึงค่า
inputRef.current!.value = "new value";
```

### ข้อดี

- โค้ดน้อยกว่า
- เหมาะกับ form ที่มี input จำนวนมาก
- Performance ดีกว่าในบางกรณี

### ข้อเสีย

- ไม่สามารถควบคุมค่าได้โดยตรง
- ยากต่อการทำ form validation
- ไม่สามารถทำ conditional rendering ตามค่า input ได้ง่าย

## ปัญหาที่พบบ่อย

### 1. การเปลี่ยนจาก Uncontrolled เป็น Controlled

```typescript
// ❌ ไม่ควรทำ
const [value, setValue] = useState<string | undefined>(undefined);
<input value={value} onChange={(e) => setValue(e.target.value)} />;

// ✅ ควรทำ
const [value, setValue] = useState<string>("");
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

### 2. การใช้ ref กับ Controlled Input

```typescript
// ❌ ไม่ควรทำ
const [value, setValue] = useState("");
const inputRef = useRef<HTMLInputElement>(null);
<input
  ref={inputRef}
  value={value}
  onChange={(e) => {
    setValue(e.target.value);
    // อย่าใช้ inputRef.current!.value = "new value"
  }}
/>;

// ✅ ควรทำ
const [value, setValue] = useState("");
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

## Best Practices

1. **เลือกใช้ Controlled Input เมื่อ:**

   - ต้องการควบคุมค่า input ตลอดเวลา
   - ต้องการทำ form validation
   - ต้องการทำ conditional rendering
   - ต้องการทำ form reset

2. **เลือกใช้ Uncontrolled Input เมื่อ:**

   - มี input จำนวนมาก
   - ไม่จำเป็นต้องควบคุมค่า input ตลอดเวลา
   - ต้องการ performance ที่ดี

3. **การแก้ไขปัญหา "A component is changing an uncontrolled input to be controlled"**
   - ตรวจสอบว่า state มีค่าเริ่มต้นที่ถูกต้อง (ไม่ใช่ undefined)
   - ใช้ Controlled Input ตลอดอายุของ component
   - หลีกเลี่ยงการเปลี่ยนจาก Uncontrolled เป็น Controlled

## ตัวอย่างการแก้ไขปัญหาใน Codebase

### ก่อนแก้ไข (มีปัญหา)

```typescript
const [count, setCount] = useState<number>(0);
const inputRef = useRef<HTMLTextAreaElement>(null);

<textarea
  ref={inputRef}
  onChange={(e) => {
    setCount(e.target.value.length);
  }}
/>;
```

### หลังแก้ไข (แก้ปัญหาแล้ว)

```typescript
const [count, setCount] = useState<number>(0);
const [question, setQuestion] = useState<string>("");

<textarea
  value={question}
  onChange={(e) => {
    setQuestion(e.target.value);
    setCount(e.target.value.length);
  }}
/>;
```

## สรุป

การเลือกใช้ Controlled หรือ Uncontrolled Input ขึ้นอยู่กับความต้องการของแอพพลิเคชัน แต่สิ่งที่สำคัญคือต้องใช้อย่างสอดคล้องตลอดอายุของ component เพื่อหลีกเลี่ยงปัญหาและทำให้โค้ดมีความชัดเจนและบำรุงรักษาได้ง่าย
