# มาตรฐานและคู่มือการปฏิบัติงานของระบบ (System Engineering & Design Standards)

โปรเจกต์นี้ใช้ **Next.js (App Router, TypeScript, Tailwind CSS)** ร่วมกับ **Couchbase** โดยยึดระเบียบวิธีคิดและการออกแบบ UI/UX ตามมาตรฐานใน **[design.md](file:///d:/Y4/WH-co/design.md)** (ยึดหลัก Design Philosophy, Tokens, Restraint และ Usability แต่ประยุกต์ใช้กับระบบของเรา ไม่ทำแอปพลิเคชันต้นฉบับของเขา)

---

## 📌 สารบัญหลัก (Table of Contents)
1. [ปรัชญาและระเบียบวิธีออกแบบ UI/UX จาก design.md](#1-ปรัชญาและระเบียบวิธีออกแบบ-uiux-จาก-designmd)
2. [โครงสร้างสถาปัตยกรรม Next.js & Couchbase](#2-โครงสร้างสถาปัตยกรรม-nextjs--couchbase)
3. [มาตรฐานฐานข้อมูล Couchbase (Document Design, Scopes & Indexes)](#3-มาตรฐานฐานข้อมูล-couchbase)
4. [มาตรฐาน UX/UI และฟอนต์ภาษาไทย (Thai Typography & Usability)](#4-มาตรฐาน-uxui-และฟอนต์ภาษาไทย)
5. [กลยุทธ์การทดสอบระบบแบบครบวงจร (Full-System Testing Strategy)](#5-กลยุทธ์การทดสอบระบบแบบครบวงจร)
6. [ระเบียบปฏิบัติการแก้โค้ดเพื่อป้องกันบัคใหม่ (Zero-Regression Protocol)](#6-ระเบียบปฏิบัติการแก้โค้ดเพื่อป้องกันบัคใหม่)
7. [Checklist ตรวจสอบความพร้อมของงาน (Engineering Checklist)](#7-checklist-ตรวจสอบความพร้อมของงาน)

---

## 1. ปรัชญาและระเบียบวิธีออกแบบ UI/UX จาก design.md

> **หลักการสำคัญ: นำ "วิธีคิดการออกแบบ" (Design Tokens, Restraint, Typography Modesty, Surface Treatment, Elevation) มาใช้กับโปรเจกต์ของเรา แต่สร้างฟังก์ชันและบริบทของแอปพลิเคชันที่เรากำลังพัฒนา**

### 1.1 Restraint & Color Voltage (ความสง่างามและความเรียบง่าย)
- **Canvas ขาวสะอาด**: ใช้ Canvas สีขาวบริสุทธิ์ (`#ffffff`) ร่วมกับ Surface สีเทาอ่อนมาก (`#f7f7f7`, `#f2f2f2`) เพื่อแยกพื้นที่การทำงาน
- **Deep Ink Typography**: ใช้ข้อความสี Deep Ink (`#222222`) แทน Pure Black (`#000000`) ช่วยให้อ่านสบายตา
- **Single Accent Voltage**: มีสีหลักเด่นชัดเจนเพียงสีเดียวสำหรับ Primary Call-to-Action และจุดโฟกัสสำคัญ เพื่อดึงสายตาผู้ใช้ไปยัง Action หลักทีละอย่าง ไม่ใช้สีหลากหลายจนสับสน
- **Subtle Hairlines**: ใช้เส้นแบ่งบางละมุน (`#ebebeb`, `#dddddd`) แทนเส้นขอบหนา

### 1.2 Corner Radii & Soft Surfaces (ความโค้งมนนุ่มนวล)
- หลีกเลี่ยงมุมฉากคมแข็งในจุด Interactive
- ใช้ขนาดความโค้งมนตามมาตรฐาน:
  - `sm`: `8px` (สำหรับปุ่ม, ช่อง Input ทั่วไป)
  - `md`: `14px` (สำหรับการ์ด, Container ย่อย)
  - `lg`: `20px` (สำหรับกล่องฟังก์ชันขนาดใหญ่)
  - `full`: `9999px` (สำหรับ Pill buttons, Badges, Search bars, Round action icons)

### 1.3 Single-Tier Elevation (การใช้เงาแบบมินิมอล)
- 95% ของพื้นผิวหน้าจอเป็นแบบ **Flat** (ไม่มีเงา) มิติเกิดจากความต่างของ Surface และ Whitespace
- ใช้เงาละมุนระดับเดียวเฉพาะจุดที่มีการยกตัว (Hover) หรือ Dropdown / Modal:
  ```css
  box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, 
              rgba(0, 0, 0, 0.04) 0 2px 6px 0, 
              rgba(0, 0, 0, 0.10) 0 4px 8px 0;
  ```

### 1.4 Responsive Pacing & Collapsing Strategy
- **Breakpoints**: Mobile (< 744px), Tablet (744–1128px), Desktop (1128–1440px), Wide (> 1440px)
- **Touch Target**: ปุ่มหลักและจุดสัมผัสต้องมีขนาดไม่ต่ำกว่า `48×48px`
- **Collapsing Rules**: เมื่อหน้าจอลดขนาดลง ให้ใช้วิธีลดจำนวนคอลัมน์ของ Grid แทนการบีบให้แคบจนเสียรูป

---

## 2. โครงสร้างสถาปัตยกรรม Next.js & Couchbase

### 2.1 สถาปัตยกรรมโฟลเดอร์ (Layered Directory Structure)
```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Route Handlers)
│   ├── (auth)/           # Route Groups สำหรับ Authentication
│   ├── (dashboard)/      # Route Groups สำหรับ Core Features
│   ├── api/              # API Route Handlers (/api/v1/...)
│   ├── layout.tsx        # Root Layout พร้อมตั้งค่า Google Font (Prompt/IBM Plex)
│   └── globals.css       # Tailwind CSS & Global Design Tokens
├── components/           # UI Components
│   ├── ui/               # Reusable Atomic Elements (Button, Modal, Input, Toast)
│   ├── forms/            # Form Components พร้อม Inline Validation ภาษาไทย
│   └── feedback/         # Loading, Skeleton, EmptyState, ErrorBoundary
├── services/             # Business Logic Layer (คำนวณ, ตรวจสอบเงื่อนไข)
├── lib/
│   ├── couchbase/        # Couchbase Connection Cluster, Bucket, Scopes, Helpers
│   └── validations/      # Zod Schemas สำหรับ Validation ข้อมูลเข้า-ออก
├── repositories/         # Couchbase Data Access Layer (N1QL Queries / Key-Value Operations)
├── types/                # TypeScript Interfaces, DTOs, Enums
└── tests/                # Test Suites (Unit, Integration, E2E)
```

### 2.2 มาตรฐาน API Response Wrapper
```typescript
// สำเร็จ
interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}

// ผิดพลาด
interface ApiResponseError {
  success: false;
  error: {
    code: string;       // e.g. "DOCUMENT_NOT_FOUND", "VALIDATION_FAILED"
    message: string;    // ข้อความภาษาไทยที่สุภาพ เข้าใจง่าย
    details?: unknown;  // ข้อมูลฟิลด์ที่ผิดพลาด
  };
}
```

---

## 3. มาตรฐานฐานข้อมูล Couchbase

### 3.1 Scopes & Collections
- **Bucket**: Bucket หลักของระบบ (เช่น `main`)
- **Scope**: แบ่งตามขอบเขตงาน เช่น `warehouse`, `sales`, `users`, `system`
- **Collection**: จัดเก็บตามประเภท Entity เช่น `products`, `stocks`, `categories`, `logs`

### 3.2 Document Key Strategy & Audit Fields
- **Key Pattern**: `<collection>::<uuidv7>`
- **Audit Fields ในทุกเอกสาร**:
  ```json
  {
    "_type": "product",
    "id": "0192d4f8-7b92-71a2-9b23-11bba8f0e123",
    "createdAt": "2026-10-07T12:00:00.000Z",
    "updatedAt": "2026-10-07T12:00:00.000Z",
    "deletedAt": null,
    "createdBy": "user::admin01",
    "updatedBy": "user::admin01"
  }
  ```

### 3.3 Indexing (GSI) & Transactions
- ทุก Collection ที่มี Query ต้องมี **Global Secondary Index (GSI)** ห้ามเกิด Primary Scan ใน Production
- ใช้ **CAS (Compare-And-Swap)** ป้องกัน Race Condition เมื่อมีการอัปเดตข้อมูลพร้อมกัน
- ใช้ **Multi-Document ACID Transactions** เมื่อต้องแก้ไขข้อมูลข้ามหลาย Collection พร้อมกัน

---

## 4. มาตรฐาน UX/UI และฟอนต์ภาษาไทย

### 4.1 Thai Typography Setup
- **ฟอนต์หลัก**: ใช้ `Prompt` หรือ `IBM Plex Sans Thai` ผ่าน `next/font/google`
- **Line Height กฎเหล็ก**: กำหนด `line-height >= 1.6` (`leading-relaxed`) เสมอ ป้องกันสระและวรรณยุกต์ไทยชนหรือขาด

### 4.2 การสร้างประสบการณ์การใช้งานที่ดี (UX Best Practices)
1. **Feedback & Status Display**:
   - หน้าจอต้องตอบสนองทันที: มี Skeleton Loader หรือ Spinner ทุกครั้งที่รอข้อมูล
   - Form Submission: ปุ่มต้องมีสถานะ Loading และ Disable เพื่อป้องกัน Double Submit
2. **Inline Validation**:
   - ข้อความแจ้งเตือนสีแดงใต้ฟิลด์เป็นภาษาไทยที่ชัดเจนและสุภาพ
3. **Safety for Destructive Actions**:
   - การลบข้อมูลสำคัญหรือเปลี่ยนสถานะต้องมี Confirmation Modal เสมอ พร้อมปุ่ม "ยืนยันการลบ" และ "ยกเลิก"

---

## 5. กลยุทธ์การทดสอบระบบแบบครบวงจร (Full-System Testing)

1. **Unit Testing (Vitest)**: ตรวจสอบ Business Logic, Service Method, Helper Functions, และ Zod Validation Schemas
2. **Integration Testing**: ตรวจสอบ API Route Handlers และการทำงานร่วมกับ Couchbase (CAS / Transactions)
3. **End-to-End (E2E) Testing (Playwright)**: จำลอง User Flow จริงตั้งแต่หน้าบ้านจนถึงการบันทึกลงฐานข้อมูล
4. **Zero-Error Verification**: โค้ดต้องผ่าน `npm run lint` และ `npx tsc --noEmit` ครบ 100%

---

## 6. ระเบียบปฏิบัติการแก้โค้ดเพื่อป้องกันบัคใหม่ (Zero-Regression Protocol)

> **"ก่อนแตะโค้ด ต้องรู้ว่าใครใช้มันอยู่บ้าง และหลังแก้เสร็จ ต้องตรวจว่าฟังก์ชันเดิมยังทำงานได้ปกติ"**

1. **Trace & Map Dependencies**: ตรวจสอบหาจุดที่เรียกใช้ตัวแปร/ฟังก์ชันนี้ทั่วทั้งโปรเจกต์ก่อนเริ่มแก้
2. **Minimal & Scoped Changes**: แก้ไขเฉพาะจุดที่เป็นสาเหตุ อย่าแก้เหวี่ยง แยก Bugfix ออกจาก Refactor ชัดเจน
3. **Defensive Coding**: ตรวจสอบ Null/Undefined ด้วย `?.` และ `??` ป้องกัน Edge Cases
4. **Static Typecheck**: รัน `npx tsc --noEmit` และ `npm run lint` ทุกครั้ง
5. **Regression Verification**: รัน Test Suite ทั้งหมดเพื่อยืนยันว่าผลลัพธ์ผ่านครบถ้วน

---

## 7. Checklist ตรวจสอบความพร้อมของงาน

- [ ] นำระเบียบวิธีออกแบบจาก `design.md` มาประยุกต์ใช้กับระบบของเรา (Restraint, Soft Radii, Whitespace, Single Accent)
- [ ] โค้ดผ่าน Typecheck (`tsc`) และ Lint 100% ไม่มี Error
- [ ] ฟอนต์ภาษาไทยแสดงผลสมบูรณ์ สระและวรรณยุกต์ไม่ขาด ไม่ทับซ้อนกัน
- [ ] Couchbase Document มี Audit Fields และ GSI Indexes ครบถ้วน
- [ ] มี Form Validation และ Feedback ภาษาไทยที่ชัดเจน
- [ ] มี Modal ยืนยันก่อนการลบข้อมูลทุกครั้ง
- [ ] รัน Unit / Integration Tests ผ่านครบถ้วน
