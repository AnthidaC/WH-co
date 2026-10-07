---
name: fullstack-system-engineering
description: >-
  Use this skill whenever designing, developing, refactoring, or testing full-stack systems
  in this project with Next.js (App Router), TypeScript, Tailwind CSS, and Couchbase.
  It enforces international architecture standards (Clean/Layered architecture, Couchbase Scopes,
  Collections, Document modeling, GSI indexing, and CAS transactions), Thai UX/UI typography
  and usability guidelines, design system methodology from design.md (Restraint, single accent voltage,
  soft radii, single-tier elevation, generous whitespace), full-system testing strategies, and a rigorous
  zero-regression protocol for bug fixing.
---

# Fullstack System Engineering Runbook (Next.js + Couchbase + Design System)

คู่มือและขั้นตอนการทำงานตามมาตรฐานสากล สำหรับการออกแบบและพัฒนา Full-Stack Application ด้วย Next.js และ Couchbase ทั้งส่วนหน้าบ้าน (Frontend), หลังบ้าน (Backend), ฐานข้อมูล (Couchbase), ระเบียบวิธีออกแบบ UI/UX ตาม [design.md](file:///d:/Y4/WH-co/design.md), การทดสอบทั้งระบบ, และมาตรการป้องกันบัคใหม่

---

## 1. ระเบียบวิธีคิดและการออกแบบ UI/UX (ยึดตามแนวทางใน design.md)
*หมายเหตุ: เรายึดเฉพาะ "ระเบียบวิธีคิดและมาตรฐานการออกแบบ" (Design Methodology) มาประยุกต์ใช้กับระบบของเรา โดยไม่ทำตัวแอปพลิเคชันต้นทางของเขา*

1. **Restraint & Color Voltage**:
   - Canvas สีขาวสะอาด (`#ffffff`) ร่วมกับ Surface สีเทาอ่อนมาก (`#f7f7f7`, `#f2f2f2`)
   - ตัวอักษรสี Deep Ink (`#222222`) แทน Pure Black เพื่อความสบายตา
   - มี **Single Accent Color** โดดเด่นเพียงหนึ่งเดียวสำหรับ Primary Actions และจุดดึงสายตาสำคัญ
   - เส้นแบ่งและเส้นขอบเป็น Hairline นุ่มนวล (`#ebebeb`, `#dddddd`)
2. **Soft Radii & Friendly Surfaces**:
   - `sm` (8px) สำหรับปุ่มและอินพุตทั่วไป
   - `md` (14px) สำหรับการ์ดและคอนเทนเนอร์
   - `lg` (20px) สำหรับโมดูลขนาดใหญ่
   - `full` (9999px) สำหรับ Pill buttons, Badges, Search orbs
3. **Single-Tier Elevation (เงาแบบ Minimal)**:
   - พื้นผิวส่วนใหญ่ 95% เป็นแบบ Flat ไร้เงา
   - ใช้เงาละมุนเฉพาะจุดที่มีการยกตัว (Hover) หรือ Dropdown/Modal:
     `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0`
4. **Responsive Pacing & Collapsing**:
   - Breakpoints: Mobile (< 744px), Tablet (744–1128px), Desktop (1128–1440px)
   - Touch Target ขั้นต่ำ 48×48px สำหรับปุ่มหลัก

---

## 2. การออกแบบสถาปัตยกรรมระบบ (Architecture Design Process)

### 2.1 Next.js App Router: Clean Layered Architecture
```text
src/
├── app/                  # Next.js App Router (Server & Client Components, Route Handlers)
├── services/             # Business Logic ล้วนๆ, คำนวณ, ตรวจสอบเงื่อนไขทางธุรกิจ
├── repositories/         # ติดต่อ Couchbase (Bucket, Scope, Collection, N1QL)
├── lib/
│   ├── couchbase/        # Connection Cluster & SDK Client
│   └── validations/      # Zod Schemas
└── types/                # TypeScript Interfaces, DTOs
```
- **กฎเหล็ก**: ห้ามเขียน Couchbase Query ใน Controller หรือ Server Component โดยตรง ต้องผ่าน Repository/Service เสมอ
- **Response Format**: ต้องส่งกลับรูปแบบมาตรฐานเดียวกันทั้งระบบ:
  ```json
  {
    "success": true,
    "data": {},
    "meta": { "total": 100, "page": 1, "pageSize": 10, "timestamp": "2026-10-07T12:00:00.000Z" }
  }
  ```

### 2.2 Couchbase Data Modeling Standards
- **Scopes & Collections**: จัดหมวดหมู่ตาม Business Domain (เช่น Scope: `warehouse`, Collections: `products`, `transactions`)
- **Document Key Strategy**: `<collection>::<uuidv7>` เช่น `product::0192d4f8-7b92-71a2-9b23-11bba8f0e123`
- **Standard Audit Fields**: `_type`, `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`
- **GSI Indexing**: สร้าง Secondary Index (GSI) สำหรับทุกฟิลด์ที่มีการค้นหา/คัดกรอง ห้าม Primary Scan ใน Production
- **CAS & ACID Transactions**: ใช้ CAS สำหรับป้องกัน Concurrency Confilct และ Multi-Document Transactions เมื่อแก้ไขข้ามหลายเอกสาร

---

## 3. มาตรฐาน UX/UI ภาษาไทย (Thai UX/UI Standards)
- **Typography**: ใช้ `Prompt` หรือ `IBM Plex Sans Thai` ผ่าน `next/font/google`
- **Line Height กฎเหล็ก**: กำหนด `line-height >= 1.6` (`leading-relaxed`) เสมอ ป้องกันสระและวรรณยุกต์ไทยทับซ้อนกัน
- **Feedback & Usability**:
  - Skeleton Loader ทุกจุดที่มีการดึงข้อมูล
  - ปุ่มส่งข้อมูลมีสถานะ Loading Spinner และ Disable ป้องกัน Double Submit
  - Confirmation Modal ภาษาไทยสำหรับการกระทำสำคัญ เช่น การลบข้อมูล

---

## 4. ขั้นตอนการแก้ไขโค้ดและการป้องกันบัคใหม่ (Zero-Regression Protocol)
1. **Impact Analysis**: สแกนหา References ของโมดูล/ฟังก์ชันก่อนเริ่มแก้
2. **Isolated Scope**: แยก Bugfix ออกจาก Refactor อย่างเด็ดขาด ห้ามแก้เหวี่ยง
3. **Defensive Coding**: ตรวจสอบ Null/Undefined เสมอ ป้องกัน Edge Cases
4. **Immediate Verification**: รัน `npm run lint` และ `npx tsc --noEmit`
5. **Regression Test**: รัน Test Suite ทั้งหมด ยืนยันว่าฟังก์ชันเดิมยังทำงานได้ปกติ

---

## 5. ยุทธศาสตร์การทดสอบระบบ (Full-System Testing Strategy)
| ระดับการทดสอบ | ขอบเขต (Scope) | เครื่องมือที่แนะนำ | สิ่งที่ต้องตรวจเช็ค |
| :--- | :--- | :--- | :--- |
| **Unit Test** | Pure Functions, Service Logic, Formatters, Zod Schemas | Vitest | Happy path, Negative path, Boundary values |
| **Integration Test** | API Routes, Couchbase Operations, Repositories | Vitest + Mock / Couchbase Test Cluster | Status code, Response schema, CAS behavior |
| **Component Test** | UI Components, User Events, Form Validation | Testing Library (React) | Render ถูกต้อง, รองรับภาษาไทย, Disabled state |
| **E2E Test** | Critical User Journey จากหน้าบ้านถึง Couchbase | Playwright | Flow ล็อกอิน, การบันทึก/แก้ไขข้อมูลหลัก |

---

## 6. Checklist ก่อนส่งมอบงาน (Pre-Delivery Checklist)
- [ ] นำระเบียบวิธีออกแบบจาก `design.md` มาประยุกต์ใช้กับระบบของเรา
- [ ] โค้ดผ่าน Typecheck (`tsc`) และ Lint โดยไม่มี Error หรือ Warning
- [ ] ฟอนต์ภาษาไทยแสดงผลสมบูรณ์ สระและวรรณยุกต์ไม่ขาด ไม่ทับซ้อนกัน
- [ ] Form Validation ทำงานถูกต้อง มีข้อความแจ้งเตือนภาษาไทยที่ชัดเจน
- [ ] Couchbase Document มี Audit Fields และ GSI Indexes ครบถ้วน
- [ ] ผ่านการรัน Test Suite ทั้งหมด
