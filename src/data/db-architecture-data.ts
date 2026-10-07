/**
 * ข้อมูลโครงสร้างสถาปัตยกรรมฐานข้อมูล Couchbase สำหรับการนำเสนอ (Presentation-Ready)
 * ยึดตามมาตรฐาน GEMINI.md และ Zod Schemas ในโปรเจกต์ KAZETIX
 */

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  tag?: "PK" | "FK" | "CAS" | "TTL" | "AUDIT" | "GSI" | "ENUM";
  descriptionTh: string;
  example: any;
}

export interface CollectionDefinition {
  id: string;
  name: "concerts" | "seats" | "bookings";
  displayNameTh: string;
  scope: string;
  bucket: string;
  iconName: string;
  accentColor: string;
  descriptionTh: string;
  keyPattern: string;
  keyDescriptionTh: string;
  accessPattern: "Key-Value Sub-millisecond" | "SQL++ Query (GSI Index)" | "ACID Transaction & CAS";
  slaLatency: string;
  isFocalCore?: boolean;
  fields: SchemaField[];
  sampleDocument: Record<string, any>;
  gsiIndexes: {
    name: string;
    fields: string[];
    sqlPlusPlus: string;
    purposeTh: string;
  }[];
}

export const ARCHITECTURE_META = {
  engine: "Couchbase Capella / Server 7.6+",
  architectureType: "Multi-Model Document Database (In-Memory KV + SQL++ GSI)",
  bucket: "main",
  scope: "ticketing",
  isolationLevel: "Read Committed (Snapshot Isolation) + CAS Atomic Mutation",
  memoryQuota: "1,024 MB (In-Memory Active Working Set)",
  concurrencyProtocol: "Compare-And-Swap (CAS) Optimistic Locking",
  slaKeyMetric: "Sub-millisecond KV Read/Write (< 1 ms)",
};

export const COLLECTIONS_DATA: CollectionDefinition[] = [
  {
    id: "seats",
    name: "seats",
    displayNameTh: "Seats Collection (จุดศูนย์กลางการจอง)",
    scope: "ticketing",
    bucket: "main",
    iconName: "ShieldCheck",
    accentColor: "#ff385c", // Single Accent Voltage (Core Focal)
    isFocalCore: true,
    descriptionTh:
      "คอลเลกชันศูนย์กลางที่รองรับทราฟฟิกระดับ Rush Hour จัดเก็บสถานะที่นั่ง การถือสิทธิ์ชั่วคราว (Hold) พร้อมกลไก CAS Atomic Lock และ TTL 5 นาที",
    keyPattern: "seat::<concertId>::<label>",
    keyDescriptionTh:
      "Deterministic Key ช่วยให้ API สามารถดึงและล็อกข้อมูลผ่าน Key-Value ได้โดยตรง ไม่ต้องผ่าน Query Scan เช่น 'seat::fujii-kaze-bkk::VIP-01'",
    accessPattern: "Key-Value Sub-millisecond",
    slaLatency: "< 0.5 ms (Memory-First)",
    fields: [
      {
        name: "_type",
        type: 'literal("seat")',
        required: true,
        defaultValue: '"seat"',
        tag: "AUDIT",
        descriptionTh: "ระบุชนิดเอกสารเพื่อแยกประเภทใน NoSQL และรองรับ Filter Index",
        example: "seat",
      },
      {
        name: "id",
        type: "string",
        required: true,
        tag: "PK",
        descriptionTh: "Document Key รูปแบบ seat::<concertId>::<label>",
        example: "seat::fujii-kaze-bkk::VIP-01",
      },
      {
        name: "concertId",
        type: "string",
        required: true,
        tag: "FK",
        descriptionTh: "รหัสอ้างอิงรอบคอนเสิร์ต (Foreign Key เชิงตรรกะ)",
        example: "fujii-kaze-bkk",
      },
      {
        name: "hallId",
        type: "string",
        required: true,
        defaultValue: '"HALL-A"',
        descriptionTh: "รหัสฮอลล์หรืออาคารจัดแสดง",
        example: "HALL-A",
      },
      {
        name: "zone",
        type: "string",
        required: true,
        tag: "GSI",
        descriptionTh: "รหัสโซนที่นั่ง เช่น MATSURI-VIP, KIRARI-CATWALK",
        example: "MATSURI-VIP",
      },
      {
        name: "zoneName",
        type: "string",
        required: true,
        descriptionTh: "ชื่อโซนแสดงผลภาษาไทย",
        example: "โซน Matsuri VIP Box",
      },
      {
        name: "row",
        type: "string",
        required: true,
        descriptionTh: "แถวที่นั่ง เช่น A, B, C",
        example: "A",
      },
      {
        name: "seatNumber",
        type: "number",
        required: true,
        descriptionTh: "หมายเลขเก้าอี้ในแถว",
        example: 1,
      },
      {
        name: "label",
        type: "string",
        required: true,
        descriptionTh: "ป้ายกำกับที่นั่งสำหรับผู้ซื้อ เช่น VIP-01",
        example: "VIP-01",
      },
      {
        name: "price",
        type: "number",
        required: true,
        descriptionTh: "ราคาจำหน่ายของที่นั่ง (บาท)",
        example: 6500,
      },
      {
        name: "status",
        type: 'enum("AVAILABLE" | "HELD" | "BOOKED")',
        required: true,
        tag: "ENUM",
        descriptionTh: "สถานะที่นั่ง (AVAILABLE: ว่าง, HELD: ล็อกรอจ่ายเงิน, BOOKED: ชำระสำเร็จ)",
        example: "HELD",
      },
      {
        name: "heldBy",
        type: "string | null",
        required: false,
        defaultValue: "null",
        tag: "CAS",
        descriptionTh: "User ID ของผู้ที่ถือสิทธิ์ในรอบนี้ (ถูกควบคุมด้วย CAS)",
        example: "usr_991204_fan",
      },
      {
        name: "heldByName",
        type: "string | null",
        required: false,
        defaultValue: "null",
        descriptionTh: "ชื่อผู้ถือสิทธิ์ (สำหรับแสดงผลแบบเรียลไทม์)",
        example: "คุณวิภาดา (KazeFan)",
      },
      {
        name: "heldUntil",
        type: "datetime (ISO 8601) | null",
        required: false,
        defaultValue: "null",
        tag: "TTL",
        descriptionTh: "เวลาหมดอายุการถือสิทธิ์ (TTL 300 วินาที คืนสถานะอัตโนมัติหากไม่ชำระ)",
        example: "2026-11-14T19:05:00.000Z",
      },
      {
        name: "bookingId",
        type: "string | null",
        required: false,
        defaultValue: "null",
        tag: "FK",
        descriptionTh: "รหัสอ้างอิงเอกสารการจองเมื่อชำระเงินสำเร็จ (1-to-1)",
        example: "booking::0192d4f8-7b92-71a2-9b23-11bba8f0e123",
      },
      {
        name: "createdAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่สร้างเอกสาร (Audit Field)",
        example: "2026-10-01T08:00:00.000Z",
      },
      {
        name: "updatedAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่อัปเดตสถานะล่าสุด (เปลี่ยนทุกครั้งที่มีการ Hold/Book)",
        example: "2026-10-07T14:54:20.120Z",
      },
      {
        name: "deletedAt",
        type: "datetime | null",
        required: false,
        defaultValue: "null",
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่ Soft Delete (null หากยังใช้งาน)",
        example: null,
      },
      {
        name: "createdBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "ผู้สร้างเอกสาร",
        example: "system",
      },
      {
        name: "updatedBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "ผู้ที่ทำการอัปเดตล่าสุด (User ID หรือ system)",
        example: "usr_991204_fan",
      },
    ],
    sampleDocument: {
      _type: "seat",
      id: "seat::fujii-kaze-bkk::VIP-01",
      concertId: "fujii-kaze-bkk",
      hallId: "HALL-A",
      zone: "MATSURI-VIP",
      zoneName: "โซน Matsuri VIP Box",
      row: "A",
      seatNumber: 1,
      label: "VIP-01",
      price: 6500,
      status: "HELD",
      heldBy: "usr_991204_fan",
      heldByName: "คุณวิภาดา (KazeFan)",
      heldUntil: "2026-11-14T19:05:00.000Z",
      bookingId: null,
      createdAt: "2026-10-01T08:00:00.000Z",
      updatedAt: "2026-10-07T14:54:20.120Z",
      deletedAt: null,
      createdBy: "system",
      updatedBy: "usr_991204_fan",
    },
    gsiIndexes: [
      {
        name: "idx_seats_concert_zone_status",
        fields: ["concertId", "zone", "status", "row", "seatNumber"],
        sqlPlusPlus:
          "CREATE INDEX `idx_seats_concert_zone_status` ON `main`.`ticketing`.`seats`(`concertId`, `zone`, `status`, `row`, `seatNumber`) WHERE `deletedAt` IS NULL;",
        purposeTh:
          "รองรับการโหลดผังที่นั่งตามคอนเสิร์ตและโซนอย่างรวดเร็ว โดยดึงข้อมูลแบบ Covered Index หลีกเลี่ยง Primary Scan 100%",
      },
      {
        name: "idx_seats_held_expiry",
        fields: ["status", "heldUntil"],
        sqlPlusPlus:
          "CREATE INDEX `idx_seats_held_expiry` ON `main`.`ticketing`.`seats`(`status`, `heldUntil`) WHERE `status` = 'HELD';",
        purposeTh: "รองรับการกวาดตรวจ TTL สำหรับ Background Cleaner ปลดล็อกที่นั่งหลุดจองแบบ Real-time",
      },
    ],
  },
  {
    id: "concerts",
    name: "concerts",
    displayNameTh: "Concerts Collection (ข้อมูลคอนเสิร์ต & โซน)",
    scope: "ticketing",
    bucket: "main",
    iconName: "Layers",
    accentColor: "#222222",
    descriptionTh:
      "จัดเก็บข้อมูลคอนเสิร์ต ศิลปิน วันที่จัดแสดง สถานที่ และ Array ของโซนราคาและโควตาที่นั่ง จัดเก็บแบบ Embedded Document",
    keyPattern: "concert::<id>",
    keyDescriptionTh:
      "Unique Slug ID เช่น 'concert::fujii-kaze-bkk' ดึงข้อมูลหน้างานได้เร็วระดับ Sub-millisecond",
    accessPattern: "Key-Value Sub-millisecond",
    slaLatency: "< 0.3 ms (Memory Cache)",
    fields: [
      {
        name: "_type",
        type: 'literal("concert")',
        required: true,
        defaultValue: '"concert"',
        tag: "AUDIT",
        descriptionTh: "ชนิดของเอกสาร",
        example: "concert",
      },
      {
        name: "id",
        type: "string",
        required: true,
        tag: "PK",
        descriptionTh: "รหัสคอนเสิร์ต (Slug)",
        example: "fujii-kaze-bkk",
      },
      {
        name: "artist",
        type: "string",
        required: true,
        descriptionTh: "ชื่อศิลปินเจ้าของคอนเสิร์ต",
        example: "Fujii Kaze",
      },
      {
        name: "title",
        type: "string",
        required: true,
        descriptionTh: "ชื่องานคอนเสิร์ตหลัก",
        example: "Best of Fujii Kaze Live in Bangkok",
      },
      {
        name: "subtitle",
        type: "string | optional",
        required: false,
        descriptionTh: "คำบรรยายเสริมหรือชื่อทัวร์",
        example: "2026 World Tour - Impact Arena Arena Show",
      },
      {
        name: "venue",
        type: "string",
        required: true,
        descriptionTh: "สถานที่จัดการแสดง",
        example: "Impact Arena, เมืองทองธานี",
      },
      {
        name: "date",
        type: "string",
        required: true,
        descriptionTh: "วันที่จัดแสดง",
        example: "เสาร์ที่ 14 พฤศจิกายน 2026",
      },
      {
        name: "time",
        type: "string",
        required: true,
        descriptionTh: "เวลาเริ่มการแสดง",
        example: "19:00 น.",
      },
      {
        name: "status",
        type: 'enum("OPEN_FOR_SALE" | "SOLD_OUT" | "UPCOMING")',
        required: true,
        tag: "ENUM",
        descriptionTh: "สถานะการเปิดจำหน่ายบัตร",
        example: "OPEN_FOR_SALE",
      },
      {
        name: "posterUrl",
        type: "string | optional",
        required: false,
        descriptionTh: "URL ของภาพโปสเตอร์",
        example: "/posters/fujii-kaze.jpg",
      },
      {
        name: "zones",
        type: "array<ConcertZone>",
        required: true,
        descriptionTh: "Array ฝังข้อมูลโซนที่นั่ง ราคา และสีประจำโซน (Embedded Document)",
        example: [
          {
            id: "MATSURI-VIP",
            name: "โซน Matsuri VIP Box",
            price: 6500,
            color: "#ff385c",
            totalSeats: 10,
          },
        ],
      },
      {
        name: "createdAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่สร้างคอนเสิร์ต",
        example: "2026-09-01T04:00:00.000Z",
      },
      {
        name: "updatedAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่อัปเดตข้อมูลล่าสุด",
        example: "2026-10-01T08:00:00.000Z",
      },
      {
        name: "deletedAt",
        type: "datetime | null",
        required: false,
        defaultValue: "null",
        tag: "AUDIT",
        descriptionTh: "Soft Delete timestamp",
        example: null,
      },
      {
        name: "createdBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "ผู้สร้างคอนเสิร์ต",
        example: "system",
      },
      {
        name: "updatedBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "ผู้อัปเดตล่าสุด",
        example: "system",
      },
    ],
    sampleDocument: {
      _type: "concert",
      id: "fujii-kaze-bkk",
      artist: "Fujii Kaze",
      title: "Best of Fujii Kaze Live in Bangkok",
      subtitle: "2026 World Tour - Impact Arena Arena Show",
      venue: "Impact Arena, เมืองทองธานี",
      date: "เสาร์ที่ 14 พฤศจิกายน 2026",
      time: "19:00 น.",
      status: "OPEN_FOR_SALE",
      posterUrl: "/posters/fujii-kaze.jpg",
      zones: [
        {
          id: "MATSURI-VIP",
          name: "โซน Matsuri VIP Box",
          price: 6500,
          color: "#ff385c",
          totalSeats: 10,
          description: "แถวหน้าสุดติดเวที ได้รับโฟโต้การ์ดลิมิเต็ด + Soundcheck Access",
        },
        {
          id: "KIRARI-CATWALK",
          name: "โซน Kirari Catwalk",
          price: 4500,
          color: "#f59e0b",
          totalSeats: 15,
          description: "ใกล้แคทวอล์กทางเดินกลาง มองเห็นศิลปินระยะประชิด",
        },
        {
          id: "SEATED-B",
          name: "โซน Seated Hall B",
          price: 2500,
          color: "#3b82f6",
          totalSeats: 20,
          description: "อัฒจันทร์ยกระดับ สบายตา ได้ยินพลังเสียงสเตอริโอรอบทิศ",
        },
      ],
      createdAt: "2026-09-01T04:00:00.000Z",
      updatedAt: "2026-10-01T08:00:00.000Z",
      deletedAt: null,
      createdBy: "system",
      updatedBy: "system",
    },
    gsiIndexes: [
      {
        name: "idx_concerts_status",
        fields: ["status", "date"],
        sqlPlusPlus:
          "CREATE INDEX `idx_concerts_status` ON `main`.`ticketing`.`concerts`(`status`, `date`) WHERE `deletedAt` IS NULL;",
        purposeTh: "ค้นหาคอนเสิร์ตที่เปิดจำหน่าย (OPEN_FOR_SALE) เรียงตามวันจัดแสดงเพื่อขึ้นหน้าแรก",
      },
    ],
  },
  {
    id: "bookings",
    name: "bookings",
    displayNameTh: "Bookings Collection (บันทึกธุรกรรมการชำระเงิน)",
    scope: "ticketing",
    bucket: "main",
    iconName: "FileJson",
    accentColor: "#059669",
    descriptionTh:
      "จัดเก็บหลักฐานการจองที่ชำระเงินสำเร็จ (Immutable Financial Ledger) ผูกกับ CAS Token ของที่นั่ง เพื่อให้ตรวจสอบย้อนกลับได้แบบ 100% Audit Trail",
    keyPattern: "booking::<uuid>",
    keyDescriptionTh:
      "UUID Version 7 (Time-ordered) เช่น 'booking::0192d4f8-7b92-71a2-9b23-11bba8f0e123'",
    accessPattern: "ACID Transaction & CAS",
    slaLatency: "< 0.8 ms (Append-only Upsert)",
    fields: [
      {
        name: "_type",
        type: 'literal("booking")',
        required: true,
        defaultValue: '"booking"',
        tag: "AUDIT",
        descriptionTh: "ระบุชนิดเอกสารการจอง",
        example: "booking",
      },
      {
        name: "id",
        type: "string",
        required: true,
        tag: "PK",
        descriptionTh: "Document Key รูปแบบ booking::<uuid>",
        example: "booking::0192d4f8-7b92-71a2-9b23-11bba8f0e123",
      },
      {
        name: "concertId",
        type: "string",
        required: true,
        tag: "FK",
        descriptionTh: "รหัสคอนเสิร์ตที่ทำการจอง",
        example: "fujii-kaze-bkk",
      },
      {
        name: "seatId",
        type: "string",
        required: true,
        tag: "FK",
        descriptionTh: "รหัสที่นั่งที่ผูกกับตั๋วใบนี้",
        example: "seat::fujii-kaze-bkk::VIP-01",
      },
      {
        name: "seatLabel",
        type: "string",
        required: true,
        descriptionTh: "ป้ายกำกับที่นั่งสำหรับออกตั๋ว เช่น VIP-01",
        example: "VIP-01",
      },
      {
        name: "zoneName",
        type: "string",
        required: true,
        descriptionTh: "ชื่อโซน",
        example: "โซน Matsuri VIP Box",
      },
      {
        name: "userId",
        type: "string",
        required: true,
        tag: "GSI",
        descriptionTh: "รหัสประจำตัวผู้ใช้งานที่สั่งซื้อ",
        example: "usr_991204_fan",
      },
      {
        name: "userName",
        type: "string",
        required: true,
        descriptionTh: "ชื่อผู้รับสิทธิ์เข้าชม",
        example: "คุณวิภาดา (KazeFan)",
      },
      {
        name: "pricePaid",
        type: "number",
        required: true,
        descriptionTh: "ยอดเงินสุทธิที่ชำระ (บาท)",
        example: 6500,
      },
      {
        name: "paymentStatus",
        type: 'enum("PAID" | "FAILED" | "EXPIRED")',
        required: true,
        tag: "ENUM",
        descriptionTh: "สถานะการชำระเงิน",
        example: "PAID",
      },
      {
        name: "casToken",
        type: "string",
        required: true,
        tag: "CAS",
        descriptionTh: "CAS Token ที่ได้รับการยืนยันตอนทำการล็อกที่นั่ง ใช้เป็น Cryptographic Evidence",
        example: "173820918290001",
      },
      {
        name: "createdAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่บันทึกธุรกรรมสำเร็จ",
        example: "2026-10-07T14:55:12.340Z",
      },
      {
        name: "updatedAt",
        type: "datetime (ISO 8601)",
        required: true,
        tag: "AUDIT",
        descriptionTh: "วันเวลาที่แก้ไขล่าสุด",
        example: "2026-10-07T14:55:12.340Z",
      },
      {
        name: "deletedAt",
        type: "datetime | null",
        required: false,
        defaultValue: "null",
        tag: "AUDIT",
        descriptionTh: "Soft Delete timestamp",
        example: null,
      },
      {
        name: "createdBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "User ID ของผู้ทำรายการ",
        example: "usr_991204_fan",
      },
      {
        name: "updatedBy",
        type: "string",
        required: true,
        tag: "AUDIT",
        descriptionTh: "User ID หรือระบบที่อัปเดต",
        example: "usr_991204_fan",
      },
    ],
    sampleDocument: {
      _type: "booking",
      id: "booking::0192d4f8-7b92-71a2-9b23-11bba8f0e123",
      concertId: "fujii-kaze-bkk",
      seatId: "seat::fujii-kaze-bkk::VIP-01",
      seatLabel: "VIP-01",
      zoneName: "โซน Matsuri VIP Box",
      userId: "usr_991204_fan",
      userName: "คุณวิภาดา (KazeFan)",
      pricePaid: 6500,
      paymentStatus: "PAID",
      casToken: "173820918290001",
      createdAt: "2026-10-07T14:55:12.340Z",
      updatedAt: "2026-10-07T14:55:12.340Z",
      deletedAt: null,
      createdBy: "usr_991204_fan",
      updatedBy: "usr_991204_fan",
    },
    gsiIndexes: [
      {
        name: "idx_bookings_user_created",
        fields: ["userId", "createdAt"],
        sqlPlusPlus:
          "CREATE INDEX `idx_bookings_user_created` ON `main`.`ticketing`.`bookings`(`userId`, `createdAt` DESC) WHERE `deletedAt` IS NULL;",
        purposeTh: "รองรับหน้า 'บัตรของฉัน' (My Tickets) เพื่อดึงประวัติตั๋วของผู้ใช้แต่ละคนอย่างรวดเร็ว",
      },
      {
        name: "idx_bookings_seat_cas",
        fields: ["seatId", "casToken"],
        sqlPlusPlus:
          "CREATE INDEX `idx_bookings_seat_cas` ON `main`.`ticketing`.`bookings`(`seatId`, `casToken`);",
        purposeTh: "ป้องกันและตรวจสอบ Audit ซ้ำซ้อนระหว่างที่นั่งและโทเค็น CAS",
      },
    ],
  },
];

export interface CasLifecycleStep {
  stepNumber: string;
  titleTh: string;
  subTitleTh: string;
  actor: "CLIENT" | "API" | "COUCHBASE_KV" | "CAS_VALIDATOR";
  status: "NORMAL" | "WINNER" | "REJECTED";
  descriptionTh: string;
  technicalDetail: string;
  latencyMs: string;
}

export const CAS_LIFECYCLE_STEPS: CasLifecycleStep[] = [
  {
    stepNumber: "01",
    titleTh: "อ่านข้อมูลที่นั่งพร้อม CAS ล่าสุด",
    subTitleTh: "Sub-millisecond KV Read",
    actor: "COUCHBASE_KV",
    status: "NORMAL",
    descriptionTh:
      "เมื่อแฟนเพลงคลิกเลือกที่นั่ง ระบบเรียก Key-Value Read โดยตรงไปยังหน่วยความจำ ได้ทั้ง Payload ที่นั่งและ CAS Token ปัจจุบัน (เช่น 173820918290001)",
    technicalDetail: "couchbase.get('seats', 'seat::fujii-kaze-bkk::VIP-01') -> { value, cas: '173820918290001' }",
    latencyMs: "0.24 ms",
  },
  {
    stepNumber: "02",
    titleTh: "แฟนเพลง N คน กดยืนยันพร้อมกันใน 1 millisecond",
    subTitleTh: "High-Concurrency Fan Rush Trigger",
    actor: "CLIENT",
    status: "NORMAL",
    descriptionTh:
      "คำขอหลายร้อยคำขอส่งเข้ามาที่ API พร้อมกัน ทุกคนถือ CAS Token เดียวกันที่อ่านได้จาก Step 01 พยายามจะจองที่นั่งตัวเดียวกัน",
    technicalDetail: "POST /api/ticket/hold { seatId, expectedCas: '173820918290001', userId }",
    latencyMs: "0.00 ms",
  },
  {
    stepNumber: "03",
    titleTh: "ผู้ชนะคนแรกผ่าน CAS Atomic Replace",
    subTitleTh: "Compare-And-Swap Match Success",
    actor: "CAS_VALIDATOR",
    status: "WINNER",
    descriptionTh:
      "คำขอแรกที่แตะถึง Couchbase Engine จะตรวจพบว่า CAS Token ตรงกัน (Match!) จึงทำการ Replace ในระดับ Hardware Memory Atomicity เปลี่ยนสถานะเป็น HELD พร้อมออก CAS ใหม่เป็น 173820918290002",
    technicalDetail:
      "couchbase.replace(seatId, { status: 'HELD', heldBy: 'UserA' }, expectedCas: '173820918290001') -> SUCCESS",
    latencyMs: "0.45 ms",
  },
  {
    stepNumber: "04",
    titleTh: "คำขอที่เหลือถูกปฏิเสธทันที (Zero Double Booking)",
    subTitleTh: "Atomic CAS Mismatch Rejection",
    actor: "CAS_VALIDATOR",
    status: "REJECTED",
    descriptionTh:
      "คำขอของคนที่ 2, 3, ... ถึง N จะถูกตรวจพบว่า CAS Token ในระบบเปลี่ยนไปแล้ว (กลายเป็น 173820918290002) จึงล้มเหลวทันทีด้วย CasMismatchError ในเสี้ยววินาที ไม่เกิดการทับซ้อนและไม่มีปัญหา Row Lock ค้าง",
    technicalDetail:
      "couchbase.replace(..., expectedCas: '173820918290001') -> THROW CasMismatchError (Zero Lock Contention)",
    latencyMs: "0.78 ms",
  },
  {
    stepNumber: "05",
    titleTh: "การชำระเงินหรือการหลุดจองตามเวลา TTL",
    subTitleTh: "Settlement or Auto-Expiry Cleanup",
    actor: "API",
    status: "NORMAL",
    descriptionTh:
      "ผู้ชนะมีเวลา 5 นาที (TTL 300 วินาที) หากชำระเงินสำเร็จจะสร้างเอกสารใน Bookings collection และเปลี่ยนสถานะที่นั่งเป็น BOOKED หากหมดเวลา ที่นั่งจะปลดล็อกกลับเป็น AVAILABLE โดยอัตโนมัติ",
    technicalDetail:
      "Payment Success: Upsert 'booking::<uuid>' + Replace seat status = 'BOOKED' with New CAS",
    latencyMs: "0.82 ms",
  },
];

export interface RdbmsComparisonItem {
  featureTh: string;
  couchbaseWay: string;
  traditionalRdbms: string;
  whyCouchbaseWinsTh: string;
}

export const RDBMS_COMPARISONS: RdbmsComparisonItem[] = [
  {
    featureTh: "กลไกการล็อกสิทธิ์ (Concurrency Control)",
    couchbaseWay: "Lock-Free Optimistic CAS (Hardware-level Compare-And-Swap)",
    traditionalRdbms: "Pessimistic Row Lock (`SELECT ... FOR UPDATE` หรือ Table Lock)",
    whyCouchbaseWinsTh: "ไม่มีปัญหา Deadlock, ไม่ทำให้ Thread Pool ล้น คลื่นคำขอหลายหมื่นรับได้แบบไร้คอขวด",
  },
  {
    featureTh: "ความเร็วในการอ่าน/เขียน (Latency SLA)",
    couchbaseWay: "Sub-millisecond (0.2 – 0.8 ms) ผ่าน Memory-First Key-Value",
    traditionalRdbms: "20 – 150 ms ต้องแย่งกันแย่ง Disk I/O และ Lock Queues",
    whyCouchbaseWinsTh: "ตอบสนองผู้ใช้ได้ทันที ไม่เกิดอาการหน้าเว็บค้างหรือกดซ้ำ (Spam Click)",
  },
  {
    featureTh: "การหมดอายุของที่นั่งหลุดจอง (Hold Expiration)",
    couchbaseWay: "Document-level Native TTL (หมดเวลาคืนสถานะทันทีในระดับ Memory)",
    traditionalRdbms: "ต้องรัน Cron Job หรือ Worker วน Loop คิวรีหาแถวที่หมดเวลาทุกนาที",
    whyCouchbaseWinsTh: "ลดภาระ Server 100% ที่นั่งที่หลุดจะคืนสิทธิ์ให้แฟนเพลงคนอื่นทันทีในระดับวินาที",
  },
  {
    featureTh: "การขยายสเกลรองรับแฟนเพลง (Scalability)",
    couchbaseWay: "Auto-sharding ผ่าน 1,024 vBuckets ขยาย Cluster Node ได้แบบ Zero-Downtime",
    traditionalRdbms: "Vertical Scale (ขยายเครื่องใหญ่ขึ้น) หรือ Read Replica ที่ติดปัญหา Write Bottleneck",
    whyCouchbaseWinsTh: "กระจาย Hash Key ทำให้ที่นั่งแต่ละตัวถูกจัดการบน Memory Core แยกกัน",
  },
  {
    featureTh: "การตรวจสอบโครงสร้างเอกสาร (Schema Safety)",
    couchbaseWay: "Strict Zod Schemas ที่ Application Layer ป้องกันข้อผิดพลาดก่อนลง DB",
    traditionalRdbms: "Relational Schema DDL แข็งทื่อ แก้ไขโครงสร้างยากตอนมีคอนเสิร์ตจริง",
    whyCouchbaseWinsTh: "มีความยืดหยุ่นสูงของ NoSQL แต่ปลอดภัย 100% ตามมาตรฐาน Type-Safe สากล",
  },
];
