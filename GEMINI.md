# Full-Stack Engineering & Development Standards (Next.js + Couchbase)

โปรเจกต์นี้ใช้ **Next.js (App Router, TypeScript, Tailwind CSS)** ร่วมกับ **Couchbase** โดยยึดถือมาตรฐานสากล (International Standards) มุ่งเน้นความปลอดภัย การออกแบบ UX/UI ภาษาไทยที่ใช้งานง่าย การทดสอบทั้งระบบ และกฎเหล็กการป้องกันบัคใหม่ (Zero-Regression Protocol)

---

## 1. ปรัชญาและระเบียบวิธีออกแบบ UI/UX (ยึดตามวิธีคิดใน design.md)
> **"ยึดเฉพาะระเบียบวิธีคิดและมาตรฐานการออกแบบ (Design Methodology) จาก `design.md` ไม่ทำตัวแอปพลิเคชันของเขา แต่ประยุกต์ใช้กับระบบของเรา"**

1. **Restraint & Single Accent Voltage (ความสง่างามแบบมินิมอลและใช้สีอย่างประหยัด)**:
   - ใช้สีพื้นหลัง Canvas ขาวสะอาดตา (`#ffffff`, `#f7f7f7`, `#f2f2f2`)
   - ใช้สีตัวอักษรหลักเป็น Deep Ink (`#222222`) แทน Pure Black (`#000000`) เพื่อความสบายตา
   - ตัวอักษรรองใช้ Muted (`#6a6a6a`, `#929292`) เส้นขอบใช้ Hairline ละเอียด (`#ebebeb`, `#dddddd`)
   - มี **Single Accent Color** เด่นเพียงสีเดียวสำหรับ Primary Action (ปุ่มดำเนินการหลัก, จุดโฟกัสสำคัญ) ไม่ใช้สีสะเปะสะปะ
2. **Modest Typography & Thai Harmony**:
   - ไม่ใช้น้ำหนักฟอนต์ที่หนาเทอะทะ (ใช้ Display ขนาดพอดี 22–28px, น้ำหนัก 500–600)
   - ผสานกับฟอนต์ภาษาไทย (`Prompt` หรือ `IBM Plex Sans Thai`) ด้วย `line-height >= 1.6` เสมอ
3. **Soft Radii & Friendly Surfaces (ขอบโค้งมนนุ่มนวล)**:
   - พื้นผิว Interactive ส่วนใหญ่มีความโค้งมนนุ่มนวล: 8px (`sm`), 14px (`md`), 20px (`lg`), และ 9999px (`full`)
4. **Single-tier Elevation (การใช้เงาแบบมินิมอล)**:
   - 95% ของพื้นผิวเป็น Flat (ไร้เงา)
   - ใช้เงาแบบ Float นุ่มนวลเฉพาะจุด Hover/Dropdown:
     `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0`
   - มิติของหน้าจอเกิดขึ้นจากความสะอาดของ Whitespace และความต่างของพื้นผิวขาว/เทาอ่อน
5. **Responsive & Collapsing Strategy**:
   - วาง Breakpoints ชัดเจน: Mobile (< 744px), Tablet (744–1128px), Desktop (1128–1440px)
   - Touch Target สำหรับปุ่มและจุดคลิกต้องไม่ต่ำกว่า 48×48px

---

## 2. กฎเหล็กในการแก้ไขโค้ดและการป้องกันบัคใหม่ (Zero-Regression Protocol)
> **"ห้ามแก้โค้ดแบบเหวี่ยง และต้องตรวจเช็คผลกระทบทุกครั้งก่อนบันทึก"**

1. **Pre-modification Impact Analysis (วิเคราะห์ผลกระทบก่อนเริ่มแก้)**:
   - ตรวจสอบจุดที่มีการเรียกใช้ฟังก์ชัน/คอมโพเนนต์/โมดูลทั้งหมด (`references check`)
   - ห้ามเปลี่ยน Interface/Type หรือ Return type ของฟังก์ชันสาธารณะโดยไม่จัดการจุดที่เรียกใช้เดิม
   - แยกงานชัดเจน: **ห้ามผสมการแก้บัค (Bug Fix) รวมกับการปรับปรุงโครงสร้างใหญ่ (Refactoring) ในรอบเดียวกัน**
2. **Defensive Coding Practices**:
   - ป้องกัน `null` และ `undefined` ด้วย Optional Chaining (`?.`) และ Nullish Coalescing (`??`) เสมอ
   - ป้องกัน Edge Cases: Empty State, Type Mismatch, Data Bounds, การกดย้ำ (Debounce/Disabled State)
   - ไม่ลบโค้ดเดิมหรือคอมเมนต์ที่มีประโยชน์โดยไม่เข้าใจบริบทเดิมทั้งหมด
3. **Post-modification Verification (การตรวจสอบหลังแก้ไขทุกครั้ง)**:
   - ตรวจสอบ Typescript และ Linter ด้วย `npm run lint` / `npx tsc --noEmit` เสมอ ห้ามปล่อยให้มี Type Errors
   - รัน Test Suites ที่เกี่ยวข้องเพื่อยืนยันว่าการแก้ไขไม่ทำลายฟังก์ชันเดิม
   - ทดสอบจำลองการใช้งานในระบบจริง (Manual/Automated Smoke Test) ทุกครั้ง

---

## 3. มาตรฐานสถาปัตยกรรมระบบ (Architecture Standards)

### 3.1 Next.js (App Router) Architecture
- **Separation of Concerns**:
  - **Server Components (Default)**: ใช้สำหรับการ Fetch ข้อมูล, SEO, และการเรนเดอร์เนื้อหาหลักที่ไม่มี Interaction
  - **Client Components (`'use client'`)**: ใช้เฉพาะจุดที่มี Interactivity (State, Event Listeners, Browser APIs, Hook)
  - **Layered Backend / API**:
    - `app/api/.../route.ts` หรือ Server Actions: รับ Request, ตรวจสอบ Authentication, ทำ Validation
    - `services/`: Business Logic ล้วนๆ ไม่ยึดติดกับ Next.js HTTP Request
    - `repositories/` หรือ `lib/couchbase/`: จัดการติดต่อ Couchbase Cluster, Collections, และ SQL++ Queries
    - `validators/`: Zod Schemas สำหรับตรวจ Input และ Document Structure
- **API Response Wrapper**:
  - สำเร็จ: `{ "success": true, "data": ..., "meta": { "timestamp": "..." } }`
  - ล้มเหลว: `{ "success": false, "error": { "code": "VALIDATION_FAILED", "message": "ข้อความภาษาไทยที่เข้าใจง่าย" } }`

### 3.2 Couchbase Design Standards (มาตรฐานฐานข้อมูล Couchbase)
- **Scopes & Collections**:
  - จัดหมวดหมู่ตาม Business Domain (เช่น Bucket: `main`, Scope: `warehouse`, Collections: `products`, `transactions`)
- **Document Key Strategy**:
  - ใช้รูปแบบที่มีความหมายชัดเจน: `<collection>::<uuid_or_id>` เช่น `product::0192d4f8-7b92-71a2-9b23-11bba8f0e123`
- **Schema Validation (Application Layer via Zod)**:
  - แม้ Couchbase จะเป็น Document NoSQL แต่ต้องมี Strict Zod Schema ดักจับทุก Document ก่อน Save/Update เสมอ
- **Audit Fields ในทุก Document**:
  - `_type`: ระบุชนิดของ Document เช่น `"product"`
  - `createdAt`: ISO 8601 String หรือ Epoch Timestamp
  - `updatedAt`: ISO 8601 String หรือ Epoch Timestamp
  - `deletedAt`: สำหรับ Soft Delete (null หากยังไม่ถูกลบ)
  - `createdBy` / `updatedBy`: User ID ผู้ทำรายการ
- **Indexing (GSI - Global Secondary Indexes)**:
  - สร้าง Index ผ่าน SQL++ (N1QL) สำหรับฟิลด์ที่ใช้ค้นหาบ่อย หลีกเลี่ยง Primary Scan ใน Production โดยเด็ดขาด
- **Transactions & Concurrency**:
  - ใช้ Couchbase ACID Multi-document Transactions เมื่อมีการแก้ไขข้อมูลหลาย Collection พร้อมกัน
  - ใช้ CAS (Compare-And-Swap) ป้องกัน Race Condition เมื่อมีการอัปเดตข้อมูลพร้อมกัน

### 3.3 มาตรฐาน UX/UI และการสื่อสารภาษาไทย
- **Typography**: ฟอนต์ `Prompt` หรือ `IBM Plex Sans Thai` กำหนด `line-height >= 1.6`
- **UX Best Practices**:
  - มี **Skeleton Loader** ขณะ Fetching ข้อมูล
  - มี **Inline Form Errors** ภาษาไทยที่สุภาพ ชัดเจน
  - มี **Confirmation Modal** ภาษาไทยสำหรับการกระทำสำคัญ
  - มี **Empty States** ที่แนะนำขั้นตอนถัดไป

---

## 4. มาตรฐานการทดสอบระบบ (Full-System Testing Strategy)
- **Unit Tests (Vitest)**: ตรวจสอบ Business Logic ใน Services, Formatters, และ Validation Schemas
- **Integration Tests**: ทดสอบ API Routes และ Couchbase Operations
- **E2E Tests (Playwright)**: ทดสอบ Critical User Journey หน้าบ้านจนถึงการบันทึกข้อมูล
- **Test Coverage**: มุ่งเน้นครอบคลุม Core Business Logic อย่างน้อย 80%+
