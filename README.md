# KAZETIX Couchbase Rush Engine 🎫⚡

ระบบจำลองการกดบัตรคอนเสิร์ตความเร็วสูงระดับ Enterprise พร้อมสถาปัตยกรรม **Couchbase NoSQL (In-Memory KV & Atomic CAS Concurrency Protection)** สร้างด้วย **Next.js 15 (App Router)**, **TypeScript** และ **Tailwind CSS**

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **ระบบจองและซื้อตั๋วคอนเสิร์ตแบบ Real-time**:
   - เลือกดูคอนเสิร์ต ค้นหาโซน และเลือกที่นั่งบน Interactive Stage Grid
   - ระบบนับถอยหลังการล็อกสิทธิ์ (Hold Seat Timer 5 นาที)
   - โมดอลกรอกข้อมูลผู้เข้าชมและการชำระเงิน (PromptPay / Credit Card)
   - บัตรคอนเสิร์ตดิจิทัล (E-Ticket) พร้อม QR Code
2. **Couchbase Rush Engine & CAS Protection**:
   - ป้องกันการจองซ้ำ (Double Booking) ระดับ Sub-millisecond ด้วย Atomic CAS (Compare-And-Swap)
   - ปุ่มจำลองการปะทะ (Fan Rush Simulation) ทดสอบยิงพร้อมกัน 20–50 คนในเสี้ยววินาทีเดียว
   - รายงานผลแบบละเอียดว่าใครชนะ และใครถูกปฏิเสธด้วย CAS Mismatch
3. **Interactive Architectural Blueprint (`/db-architecture`)**:
   - แผนผังความสัมพันธ์ระดับ Collection (Topology & Data Flow)
   - Document Schema Dictionary & Audit Fields พร้อม Zod Validation
   - CAS Concurrency Lifecycle Sequence
   - GSI (Global Secondary Index) & SQL++ (N1QL) Covered Queries
   - ตารางเปรียบเทียบสถาปัตยกรรม Couchbase vs Traditional RDBMS

---

## 🚀 เริ่มต้นใช้งานบนเครื่องคอมพิวเตอร์ (Getting Started)

### ติดตั้ง Dependencies
```bash
npm install
```

### เริ่มต้น Dev Server
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### ทดสอบและตรวจสอบโค้ด (Quality Assurance)
```bash
# รัน Unit Tests (Vitest)
npm run test

# ตรวจสอบ TypeScript Types
npm run typecheck

# ตรวจสอบ Linter
npm run lint

# Build สำหรับ Production
npm run build
```

---

## 🌐 การนำขึ้นระบบออนไลน์ (Deployment Guide)

### 1. วิธีที่แนะนำที่สุด: Vercel (ฟรี & รองรับครบ 100%)
เนื่องจากโปรเจกต์นี้ใช้ **Next.js App Router** ที่มี API Routes (`/api/...`) สำหรับจำลองระบบ Couchbase CAS Engine:
1. นำโค้ดขึ้น GitHub Repository
2. ไปที่ [vercel.com](https://vercel.com) ล็อกอินด้วยบัญชี GitHub
3. คลิก **"Add New Project"** แล้วเลือก Repository นี้
4. กด **Deploy** ระบบจะ Build และให้ URL ออนไลน์ (เช่น `https://kazetix.vercel.app`) ทันทีโดยไม่ต้องตั้งค่าเพิ่มเติม

---

## 🛠️ Stack & Technologies

- **Frontend & Backend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Vitest
- **Database Engine Simulation**: Couchbase In-Memory KV, CAS, GSI Indexing

---

จัดทำขึ้นเพื่อการศึกษาและการสาธิตสถาปัตยกรรมระบบฐานข้อมูลความเร็วสูง
