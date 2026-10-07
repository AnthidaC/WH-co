# 🎫⚡ KAZETIX - Couchbase Rush Engine
> **High-Concurrency Concert Ticketing Platform with Atomic CAS Protection**  
> ระบบจำลองการกดบัตรคอนเสิร์ตความเร็วสูงระดับ Enterprise ออกแบบสถาปัตยกรรมบน **Couchbase NoSQL (In-Memory Key-Value, CAS Concurrency Protection & GSI Indexing)**  
> ขับเคลื่อนด้วย **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** และ **Vitest**

---

## 🌟 จุดเด่นของระบบ (System Highlights)

* **🛡️ Zero Double-Booking (Atomic CAS Guarantee)**: ป้องกันปัญหาการกดบัตรชนกันหรือแย่งที่นั่งซ้ำในเสี้ยววินาทีเดียวกัน (Race Condition) ด้วยกลไก `Compare-And-Swap (CAS)`
* **⚡ Sub-Millisecond Latency**: จำลองการดึงและอัปเดตข้อมูลระดับหน่วยความจำ (RAM Key-Value) รวดเร็วต่ำกว่า 1 มิลลิวินาที
* **⏳ Automatic Seat Expiration (TTL 5 นาที)**: ระบบนับเวลาถอยหลังการล็อกสิทธิ์ที่นั่งอัตโนมัติ หากไม่ชำระเงินในเวลาที่กำหนด ระบบจะคืนที่นั่งกลับสู่สถานะว่าง
* **🔥 Interactive Fan Rush Simulator**: แผงควบคุมจำลองแฟนคลับ 20–50 คน ยิงแย่งกดที่นั่งตัวเดียวกันในเสี้ยววินาทีเดียวแบบ Real-time พร้อมแสดงผล Latency และ CAS Token
* **📐 Technical Architecture Blueprint (`/db-architecture`)**: หน้าสถาปัตยกรรมสำหรับนำเสนอเชิงเทคนิค แสดง Data Flow, Schema Dictionary, Zod Validation, CAS Lifecycle และตารางเปรียบเทียบกับ Traditional RDBMS

---

## 📋 ความต้องการขั้นต่ำก่อนติดตั้ง (Prerequisites - เริ่มจาก 0)

ก่อนเริ่มต้นใช้งาน กรุณาตรวจสอบว่าเครื่องคอมพิวเตอร์ของคุณมีโปรแกรมเหล่านี้ติดตั้งอยู่:

1. **Node.js**: แนะนำเวอร์ชัน **v20 LTS** หรือ **v18.18.0 ขึ้นไป**  
   * ตรวจสอบด้วยคำสั่ง: `node -v`  
   * หากยังไม่มี ให้ดาวน์โหลดและติดตั้งจาก: [https://nodejs.org](https://nodejs.org)
2. **Git**: สำหรับดาวน์โหลดและจัดการโค้ด  
   * ตรวจสอบด้วยคำสั่ง: `git -v`  
   * หากยังไม่มี ให้ดาวน์โหลดจาก: [https://git-scm.com](https://git-scm.com)
3. **Web Browser**: Google Chrome, Microsoft Edge, Safari หรือ Firefox

---

## 🚀 ขั้นตอนการติดตั้งและเปิดใช้งานจาก 0 (Step-by-Step Installation)

### ขั้นตอนที่ 1: โคลนโปรเจกต์ (Clone Repository)
เปิดโปรแกรม **Terminal** (macOS/Linux) หรือ **Command Prompt / PowerShell** (Windows) แล้วพิมพ์:

```bash
# 1. โคลนโปรเจกต์จาก GitHub
git clone https://github.com/AnthidaC/WH-co.git

# 2. เข้าไปยังโฟลเดอร์โปรเจกต์
cd WH-co
```

---

### ขั้นตอนที่ 2: ติดตั้ง Dependencies ทั้งหมด
รันคำสั่งติดตั้งแพ็กเกจที่จำเป็นของโปรเจกต์:

```bash
npm install
```
*(ระบบจะดาวน์โหลด Next.js, React, Tailwind CSS, Lucide Icons, Zod และ Vitest โดยอัตโนมัติ)*

---

### ขั้นตอนที่ 3: เริ่มต้นใช้งานในโหมดพัฒนา (Start Development Server)
รันคำสั่งเปิดเซิร์ฟเวอร์จำลอง:

```bash
npm run dev
```

เมื่อระบบแสดงข้อความพร้อมใช้งาน ให้เปิด Web Browser แล้วเข้าไปที่:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### ขั้นตอนที่ 4: การทดสอบระบบและการตรวจสอบคุณภาพโค้ด (Quality Assurance)
คุณสามารถรันชุดการทดสอบ (Test Suites) และตรวจสอบความถูกต้องของโค้ดได้ด้วยคำสั่งต่อไปนี้:

```bash
# 1. รัน Unit Tests (ทดสอบ Business Logic และ CAS Protection ผ่าน Vitest)
npm run test

# 2. ตรวจสอบความถูกต้องของ Type ทั่วทั้งระบบ (Strict TypeScript)
npm run typecheck

# 3. ตรวจสอบคุณภาพโค้ดและมาตรฐานสากล (Next.js ESLint)
npm run lint

# 4. ทดสอบการ Build สำหรับ Production
npm run build
```

---

## 🎮 คู่มือการทดลองใช้งานฟีเจอร์เด่น (Feature Walkthrough)

### 1. ทดลองกดบัตรคอนเสิร์ตและชำระเงินจริง (Live Booking Flow)
1. เปิดหน้าแรก **[http://localhost:3000](http://localhost:3000)**
2. คลิกเลือกคอนเสิร์ตที่ต้องการ (เช่น *Fujii Kaze Live in Bangkok*)
3. คลิกปุ่ม **"จองตั๋วคอนเสิร์ต"** เพื่อเข้าสู่หน้าผังที่นั่ง
4. เลือกโซน (VIP, Zone A, Zone B) และคลิกเลือกเก้าอี้ที่ต้องการบน **ผังที่นั่ง (Stage Seat Grid)**
5. คลิกปุ่ม **"ยืนยันล็อกที่นั่ง (Hold Seat)"** 
   - สังเกตว่าแถบเวลานับถอยหลัง 5 นาทีจะเริ่มทำงานทันที
6. กรอกชื่อ-นามสกุล, ข้อมูลผู้เข้าชม และเลือกช่องทางชำระเงิน (PromptPay / บัตรเครดิต)
7. กดยืนยันเพื่อรับ **E-Ticket ดิจิทัลอย่างเป็นทางการ** พร้อม QR Code สำหรับเข้างาน

### 2. ทดลองจำลองการปะทะแย่งบัตร (Fan Rush Simulation)
1. ที่มุมขวาบนของหน้าเว็บ คลิกปุ่ม **"⚙️ Couchbase Engine"** เพื่อเปิดแผง Drawer
2. สังเกตข้อมูลสถาปัตยกรรม In-Memory, Key-Value Latency (< 1ms) และ CAS Token
3. เลือกจำนวนแฟนคลับที่ต้องการจำลอง (เช่น **20 คน** หรือ **50 คน**)
4. คลิกปุ่ม **"🚀 เริ่มจำลองการยิงคำขอพร้อมกัน"**
5. ระบบจะยิงคำขอแบบ Concurrent Promise.all:
   - **ผู้ชนะ 1 คนเท่านั้น** จะได้รับสิทธิ์และสร้าง CAS Token ใหม่
   - **ผู้ใช้อีก 19–49 คน** จะถูกปฏิเสธทันทีด้วยข้อความ `CAS Mismatch (409 Conflict)` ป้องกันการจองซ้ำ 100%

### 3. เข้าชมพิมพ์เขียวสถาปัตยกรรมเชิงลึก (Architectural Blueprint)
เข้าใช้งานได้ที่ URL: **[http://localhost:3000/db-architecture](http://localhost:3000/db-architecture)** หรือคลิกปุ่ม **"ผังสถาปัตยกรรม"** ที่ Navbar:
* **Section 01**: Topology & Data Flow Diagram เชื่อมโยง Concerts, Seats, Bookings
* **Section 02**: Schema Dictionary ตรวจสอบโครงสร้าง Document และฟิลด์ Audit (`_type`, `createdAt`, `updatedAt`, `deletedAt`)
* **Section 03**: ลำดับเวลา CAS Lifecycle (Get ➡️ Modify ➡️ Replace with CAS ➡️ Success/Conflict)
* **Section 04**: GSI Indexing & Covered Query Optimization
* **Section 05**: ตารางเปรียบเทียบ Couchbase NoSQL vs Traditional RDBMS

---

## 🌐 การนำขึ้นระบบออนไลน์ผ่าน Vercel (ฟรี & รองรับ Database API 100%)

เนื่องจากโปรเจกต์นี้ทำงานด้วย **Next.js App Router** ที่มี API Routes ด้านหลัง การนำขึ้น **Vercel** เป็นวิธีที่ง่ายและสมบูรณ์แบบที่สุด:

1. **สร้าง Repository บน GitHub**:
   - ไปที่ [github.com/new](https://github.com/new) ตั้งชื่อ Repository (เช่น `WH-co`) แล้วเลือกเป็น **Public**
2. **Push โค้ดจากเครื่องขึ้น GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/WH-co.git
   git push -u origin main
   ```
3. **เชื่อมต่อกับ Vercel**:
   - ไปที่ [vercel.com](https://vercel.com) ล็อกอินด้วยบัญชี GitHub
   - คลิก **"Add New..."** ➡️ **"Project"**
   - กดปุ่ม **"Import"** ข้าง Repository `WH-co`
   - กดปุ่ม **"Deploy"** ระบบจะ Build และสร้างโดเมนจริงให้อัตโนมัติ (เช่น `https://wh-co.vercel.app`)

---

## 📂 โครงสร้างโฟลเดอร์ของโปรเจกต์ (Project Structure)

```text
WH-co/
├── src/
│   ├── app/                      # Next.js App Router (Pages & API Routes)
│   │   ├── api/                  # Backend API Routes (Couchbase KV, CAS, Rush Battle)
│   │   │   ├── concerts/         # คอนเสิร์ตและโซน
│   │   │   ├── seats/            # ข้อมูลผังที่นั่งแบบ Real-time
│   │   │   ├── ticket/           # Hold, Confirm, Release, Reset, Simulate-Rush
│   │   │   └── couchbase/        # Cluster Stats & Health Overview
│   │   ├── db-architecture/      # หน้า Technical Presentation Blueprint
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # หน้าระบบกดบัตรหลัก (Catalog, Detail, Seatmap, MyTickets)
│   ├── components/               # React UI Components
│   │   ├── architecture/         # ไดอะแกรมและ Blueprint Components
│   │   ├── booking/              # โมดอล Checkout, Timer Banner, Success E-Ticket
│   │   ├── catalog/              # รายการคอนเสิร์ต
│   │   ├── concert/              # รายละเอียดคอนเสิร์ตและตัวกรองโซน
│   │   ├── engine/               # Couchbase Engine Drawer, Fan Rush Simulator, Latency
│   │   ├── layout/               # Navbar & Footer
│   │   ├── seatmap/              # Interactive Seat Grid & Booking Bar
│   │   └── tickets/              # หน้ารายการตั๋วของฉัน (My Bookings)
│   ├── lib/                      # Core Libraries
│   │   └── couchbase/            # In-Memory Couchbase Cluster, CAS Generator, Seed Data
│   ├── repositories/             # Data Access Repositories (Concert, Seat, Booking)
│   ├── services/                 # Business Logic (TicketService, CAS Concurrency Engine)
│   └── validators/               # Zod Schemas (Concert, Seat, Booking Document Validation)
├── tests/                        # Vitest Unit & Concurrency Test Suites
├── public/                       # รูปภาพโปสเตอร์คอนเสิร์ตและไอคอนระบบ
├── design.md                     # ปรัชญาและมาตรฐานการออกแบบ UI/UX
├── GEMINI.md                     # กฎเหล็กวิศวกรรมระบบและ Zero-Regression Protocol
├── tailwind.config.ts            # การตั้งค่า Tailwind CSS และ Color Tokens
├── tsconfig.json                 # การตั้งค่า TypeScript
└── package.json                  # สคริปต์และรายการ Dependencies
```

---

## 🛠️ รายการคำสั่งใน package.json (Available Scripts)

| คำสั่ง | คำอธิบาย |
| :--- | :--- |
| `npm run dev` | เปิดเซิร์ฟเวอร์ในโหมด Development ที่ `http://localhost:3000` |
| `npm run build` | คอมไพล์และสร้างโค้ดสำหรับ Production Build |
| `npm run start` | รันเซิร์ฟเวอร์โหมด Production หลังจากสั่ง build |
| `npm run test` | รัน Unit Tests ทั้งหมดด้วย Vitest |
| `npm run typecheck` | ตรวจสอบ TypeScript Types ทั้งหมดโดยไม่สร้างไฟล์ |
| `npm run lint` | ตรวจสอบคุณภาพโค้ดตามมาตรฐาน Next.js ESLint |

---

## 👥 ผู้พัฒนา (Author)
* **KAZETIX Engineering Team**
* พัฒนาขึ้นเพื่อการศึกษาและการสาธิตสถาปัตยกรรมระบบฐานข้อมูลความเร็วสูง (High-Concurrency Ticketing Architecture Demonstration)
