import { ConcertDocument } from "@/validators/concert.schema";
import { SeatDocument } from "@/validators/seat.schema";

const now = new Date().toISOString();

export const SEED_CONCERTS: ConcertDocument[] = [
  {
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
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    createdBy: "system",
    updatedBy: "system",
  },
  {
    _type: "concert",
    id: "cortis-debut-bkk",
    artist: "CORTIS",
    title: "CORTIS: The 1st World Tour Showcase",
    subtitle: "Debut Asia Showcase 2026 - Bangkok Stop",
    venue: "ธันเดอร์โดม (Thunder Dome), เมืองทองธานี",
    date: "อาทิตย์ที่ 22 พฤศจิกายน 2026",
    time: "18:00 น.",
    status: "OPEN_FOR_SALE",
    posterUrl: "/posters/cortis.jpg",
    zones: [
      {
        id: "CORTIS-VIP",
        name: "โซน Front VIP Stage",
        price: 5800,
        color: "#ff385c",
        totalSeats: 10,
        description: "ชิดรั้วเวที พร้อมสิทธิพิเศษ Hi-Touch กับสมาชิกวง CORTIS",
      },
      {
        id: "CORTIS-CATWALK",
        name: "โซน Standing Flow",
        price: 3800,
        color: "#8b5cf6",
        totalSeats: 15,
        description: "โซนยืนสนุกสุดเหวี่ยง กว้างขวาง แสงสีเสียงจัดเต็ม",
      },
      {
        id: "CORTIS-SEATED",
        name: "โซน Seated Tier",
        price: 2200,
        color: "#10b981",
        totalSeats: 20,
        description: "ที่นั่งขั้นบันไดมุมกว้าง มองเห็นทั้งสเตจชัดเจน",
      },
    ],
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    createdBy: "system",
    updatedBy: "system",
  },
];

export function generateSeedSeats(concertId: string): SeatDocument[] {
  const seats: SeatDocument[] = [];
  const isKaze = concertId === "fujii-kaze-bkk";

  // โซน VIP (แถว A)
  const vipZoneId = isKaze ? "MATSURI-VIP" : "CORTIS-VIP";
  const vipZoneName = isKaze ? "โซน Matsuri VIP Box" : "โซน Front VIP Stage";
  const vipPrice = isKaze ? 6500 : 5800;

  // ที่นั่ง A-01: ไฮไลท์สำคัญ! ว่างอยู่เพียงที่นั่งเดียวในแถวหน้า สำหรับโชว์ CAS Battle!
  seats.push({
    _type: "seat",
    id: `seat::${concertId}::VIP-01`,
    concertId,
    hallId: "HALL-A",
    zone: vipZoneId,
    zoneName: vipZoneName,
    row: "A",
    seatNumber: 1,
    label: "VIP-01",
    price: vipPrice,
    status: "AVAILABLE", // ว่าง! จุดปะทะ Concurrency Rush
    heldBy: null,
    heldByName: null,
    heldUntil: null,
    bookingId: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    createdBy: "system",
    updatedBy: "system",
  });

  // ที่นั่ง A-02 ถึง A-08: จำลองว่าถูกซื้อเต็มไปหมดแล้ว เพื่อกดดันให้ VIP-01 กลายเป็นตั๋วใบสุดท้าย!
  for (let i = 2; i <= 8; i++) {
    const isHeld = i === 4;
    seats.push({
      _type: "seat",
      id: `seat::${concertId}::VIP-${String(i).padStart(2, "0")}`,
      concertId,
      hallId: "HALL-A",
      zone: vipZoneId,
      zoneName: vipZoneName,
      row: "A",
      seatNumber: i,
      label: `VIP-${String(i).padStart(2, "0")}`,
      price: vipPrice,
      status: isHeld ? "HELD" : "BOOKED",
      heldBy: isHeld ? "USER-PREV-04" : "USER-SOLD-PAID",
      heldByName: isHeld ? "แฟนคลับรอชำระเงิน" : "จองแล้วเรียบร้อย",
      heldUntil: isHeld ? new Date(Date.now() + 180000).toISOString() : null,
      bookingId: isHeld ? null : `BK-SEED-${concertId}-${i}`,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: "system",
      updatedBy: "system",
    });
  }

  // โซน Catwalk (แถว B)
  const catZoneId = isKaze ? "KIRARI-CATWALK" : "CORTIS-CATWALK";
  const catZoneName = isKaze ? "โซน Kirari Catwalk" : "โซน Standing Flow";
  const catPrice = isKaze ? 4500 : 3800;

  for (let i = 1; i <= 10; i++) {
    const isAvailable = i % 3 !== 0;
    seats.push({
      _type: "seat",
      id: `seat::${concertId}::CAT-${String(i).padStart(2, "0")}`,
      concertId,
      hallId: "HALL-A",
      zone: catZoneId,
      zoneName: catZoneName,
      row: "B",
      seatNumber: i,
      label: `CAT-${String(i).padStart(2, "0")}`,
      price: catPrice,
      status: isAvailable ? "AVAILABLE" : "BOOKED",
      heldBy: null,
      heldByName: null,
      heldUntil: null,
      bookingId: isAvailable ? null : `BK-SEED-${concertId}-CAT-${i}`,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: "system",
      updatedBy: "system",
    });
  }

  // โซน Seated (แถว C)
  const seatZoneId = isKaze ? "SEATED-B" : "CORTIS-SEATED";
  const seatZoneName = isKaze ? "โซน Seated Hall B" : "โซน Seated Tier";
  const seatPrice = isKaze ? 2500 : 2200;

  for (let i = 1; i <= 12; i++) {
    const isAvailable = i % 2 !== 0;
    seats.push({
      _type: "seat",
      id: `seat::${concertId}::S-${String(i).padStart(2, "0")}`,
      concertId,
      hallId: "HALL-A",
      zone: seatZoneId,
      zoneName: seatZoneName,
      row: "C",
      seatNumber: i,
      label: `S-${String(i).padStart(2, "0")}`,
      price: seatPrice,
      status: isAvailable ? "AVAILABLE" : "BOOKED",
      heldBy: null,
      heldByName: null,
      heldUntil: null,
      bookingId: isAvailable ? null : `BK-SEED-${concertId}-S-${i}`,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: "system",
      updatedBy: "system",
    });
  }

  return seats;
}
