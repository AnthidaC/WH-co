"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConcertCatalog } from "@/components/catalog/ConcertCatalog";
import { ConcertDetailView } from "@/components/concert/ConcertDetailView";
import { ConcertHero } from "@/components/concert/ConcertHero";
import { ZoneSelector } from "@/components/concert/ZoneSelector";
import { StageSeatGrid } from "@/components/seatmap/StageSeatGrid";
import { BookingBar } from "@/components/seatmap/BookingBar";
import { HoldingTimerBanner } from "@/components/booking/HoldingTimerBanner";
import { AttendeeCheckoutModal } from "@/components/booking/AttendeeCheckoutModal";
import { TicketSuccessModal } from "@/components/booking/TicketSuccessModal";
import { MyTicketsView } from "@/components/tickets/MyTicketsView";
import { EngineDrawer } from "@/components/engine/EngineDrawer";
import { ConcertDocument } from "@/validators/concert.schema";
import { SeatDocument } from "@/validators/seat.schema";
import { BookingDocument } from "@/validators/booking.schema";
import { RushBattleResult } from "@/services/ticket.service";
import { SEED_CONCERTS } from "@/lib/couchbase/seed-data";
import { AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";

export default function HomePage() {
  const [concerts, setConcerts] = useState<ConcertDocument[]>(SEED_CONCERTS);
  // หน้าจอระบบ: "catalog" (หน้าแรก) | "detail" (รายละเอียดคอนเสิร์ต) | "seatmap" (ผังที่นั่ง) | "mytickets" (ตั๋วของฉัน)
  const [currentView, setCurrentView] = useState<"catalog" | "detail" | "seatmap" | "mytickets">("catalog");
  const [myBookings, setMyBookings] = useState<BookingDocument[]>([]);
  const [selectedConcertId, setSelectedConcertId] = useState<string>("fujii-kaze-bkk");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const [seats, setSeats] = useState<SeatDocument[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatDocument | null>(null);
  const [heldSeat, setHeldSeat] = useState<SeatDocument | null>(null);
  const [latestCasToken, setLatestCasToken] = useState<string>("173820918290001");

  // Latency Metrics
  const [lastKvLatency, setLastKvLatency] = useState<number>(0.42);
  const [lastCasLatency, setLastCasLatency] = useState<number>(0.88);
  const [lastQueryLatency, setLastQueryLatency] = useState<number>(2.35);

  // States for Engine Drawer & Rush Simulation
  const [isEngineOpen, setIsEngineOpen] = useState<boolean>(false);
  const [isSimulatingRush, setIsSimulatingRush] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<RushBattleResult | null>(null);

  // Action Loading & Modals
  const [isLoadingSeats, setIsLoadingSeats] = useState<boolean>(true);
  const [isHoldingSeat, setIsHoldingSeat] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [isResettingSeats, setIsResettingSeats] = useState<boolean>(false);

  // Completed Booking & Success Modal
  const [completedBooking, setCompletedBooking] = useState<BookingDocument | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // 1. Fetch Concerts
  const fetchConcerts = useCallback(async () => {
    try {
      const res = await fetch("/api/concerts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setConcerts(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch concerts:", err);
    }
  }, []);

  // 2. Fetch My Bookings (Couchbase SQL++ simulation)
  const fetchMyBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/ticket/my-bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.bookings)) {
        setMyBookings(json.data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch my bookings:", err);
    }
  }, []);

  // 3. Fetch Seats
  const fetchSeats = useCallback(async (concertId: string) => {
    setIsLoadingSeats(true);
    try {
      const res = await fetch(`/api/seats?concertId=${concertId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSeats(json.data.seats || []);
        if (json.meta?.durationMs) {
          setLastQueryLatency(json.meta.durationMs);
        }
      }
    } catch (err) {
      console.error("Failed to fetch seats:", err);
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  useEffect(() => {
    fetchConcerts();
    fetchMyBookings();
  }, [fetchConcerts, fetchMyBookings]);

  useEffect(() => {
    fetchSeats(selectedConcertId);
    setSelectedSeat(null);
    setHeldSeat(null);
  }, [selectedConcertId, fetchSeats]);

  // Current selected concert
  const currentConcert = concerts.find((c) => c.id === selectedConcertId) || concerts[0];

  // Target seat for simulation: เลือกตามที่นั่งที่คลิก หรือ default ไปที่ VIP-01 (หรือที่นั่งแรกที่ว่าง)
  const targetSeatId =
    selectedSeat?.id ||
    seats.find((s) => s.id === `seat::${selectedConcertId}::VIP-01`)?.id ||
    seats.find((s) => s.status === "AVAILABLE")?.id ||
    seats[0]?.id ||
    `seat::${selectedConcertId}::VIP-01`;

  const targetSeat =
    seats.find((s) => s.id === targetSeatId) ||
    selectedSeat ||
    seats[0] ||
    null;

  // Handler: เปิด Couchbase Engine Drawer พร้อมปรับพื้นหลังให้แสดงผังที่นั่งทันที
  const handleOpenEngineDrawer = () => {
    if (currentView !== "seatmap") {
      setCurrentView("seatmap");
    }
    setIsEngineOpen(true);
  };

  // Handler: นำทางไปหน้ารายละเอียดคอนเสิร์ต
  const handleViewConcertDetails = (concertId: string) => {
    setSelectedConcertId(concertId);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: นำทางเข้าสู่หน้าผังที่นั่ง
  const handleGoToSeatMap = (concertId?: string) => {
    if (concertId) setSelectedConcertId(concertId);
    setSelectedZoneId(null);
    setCurrentView("seatmap");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Seat Selection
  const handleSelectSeat = (seat: SeatDocument) => {
    setSelectedSeat(seat);
    setLatestCasToken(
      (1738209000000n + BigInt(seat.seatNumber * 1000)).toString()
    );
  };

  // 3. Hold Seat (Atomic CAS)
  const handleHoldSeat = async () => {
    if (!selectedSeat) return;
    setIsHoldingSeat(true);

    try {
      const res = await fetch("/api/ticket/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          userId: "USER-GUEST-YOU",
          userName: "คุณ (ผู้ใช้งานปัจจุบัน)",
        }),
      });

      const json = await res.json();

      if (json.success) {
        setHeldSeat(json.data.seat);
        setSelectedSeat(null);
        if (json.meta?.cas) setLatestCasToken(json.meta.cas);
        if (json.meta?.durationMs) setLastCasLatency(json.meta.durationMs);
        showToast("success", "🎉 ล็อกที่นั่งสำเร็จ! กำลังเปิดหน้ากรอกข้อมูลผู้เข้าชม");
        await fetchSeats(selectedConcertId);
        // เปิดหน้าต่างกรอกข้อมูลและชำระเงินอัตโนมัติ
        setIsCheckoutModalOpen(true);
      } else {
        const errorMsg = json.error?.message || "ไม่สามารถจองที่นั่งได้";
        showToast("error", errorMsg);
        await fetchSeats(selectedConcertId);
      }
    } catch (err: any) {
      showToast("error", "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsHoldingSeat(false);
    }
  };

  // 4. Confirm Checkout (ชำระเงินพร้อมบันทึกชื่อผู้เข้าชมจริง)
  const handleConfirmCheckout = async (attendeeData: {
    fullName: string;
    idCardLast4: string;
    phone: string;
    email: string;
    paymentMethod: "PROMPTPAY" | "CREDIT_CARD";
  }) => {
    if (!heldSeat) return;
    setIsProcessingCheckout(true);

    try {
      const res = await fetch("/api/ticket/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: heldSeat.id,
          userId: heldSeat.heldBy || "USER-GUEST-YOU",
          userName: attendeeData.fullName,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setCompletedBooking(json.data.booking);
        setIsCheckoutModalOpen(false);
        setIsSuccessModalOpen(true);
        setHeldSeat(null);
        if (json.meta?.cas) setLatestCasToken(json.meta.cas);
        showToast("success", "🎟️ ออกตั๋วคอนเสิร์ตทางการเรียบร้อย!");
        await fetchSeats(selectedConcertId);
        await fetchMyBookings();
      } else {
        showToast("error", json.error?.message || "การชำระเงินไม่สำเร็จ");
      }
    } catch (err) {
      showToast("error", "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // 5. Release Seat
  const handleReleaseSeat = async () => {
    if (!heldSeat) return;

    try {
      const res = await fetch("/api/ticket/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: heldSeat.id,
          userId: heldSeat.heldBy || "USER-GUEST-YOU",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setHeldSeat(null);
        setIsCheckoutModalOpen(false);
        showToast("info", "ยกเลิกการถือสิทธิ์เรียบร้อย ที่นั่งกลับสู่สถานะว่าง");
        await fetchSeats(selectedConcertId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Simulate Concurrency Rush (Promise.all 20-50 users)
  const handleSimulateRush = async (fanCount: number) => {
    // รับประกันว่าผังที่นั่งกำลังแสดงอยู่ข้างหลังแผงควบคุม
    if (currentView !== "seatmap") {
      setCurrentView("seatmap");
    }
    setIsSimulatingRush(true);
    try {
      const res = await fetch("/api/ticket/simulate-rush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: targetSeatId,
          fanCount,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const result = json.data as RushBattleResult;
        setBattleResult(result);
        const winnerAttempt = result.attempts.find((a) => a.status === "SUCCESS_WON");
        if (winnerAttempt?.casToken) {
          setLatestCasToken(winnerAttempt.casToken);
        }
        if (json.meta?.durationMs) {
          setLastCasLatency(Number((json.meta.durationMs / fanCount).toFixed(2)));
        }
        showToast(
          "success",
          `🎉 จำลองเสร็จสิ้น! ผู้ชนะคนเดียวคือ ${result.winnerName} (อีก ${result.rejectedCount} คน ถูกปฏิเสธด้วย CAS)`
        );
        await fetchSeats(selectedConcertId);
        return result;
      } else {
        showToast("error", json.error?.message || "การจำลองล้มเหลว");
        return null;
      }
    } catch (err) {
      showToast("error", "เกิดข้อผิดพลาดในการรันการจำลอง");
      return null;
    } finally {
      setIsSimulatingRush(false);
    }
  };

  // 7. Reset Seats
  const handleResetSeats = async () => {
    setIsResettingSeats(true);
    try {
      const res = await fetch("/api/ticket/reset", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSelectedSeat(null);
        setHeldSeat(null);
        setBattleResult(null);
        setIsCheckoutModalOpen(false);
        showToast("info", "รีเซ็ตผังที่นั่งทั้งหมดกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว");
        await fetchSeats(selectedConcertId);
        await fetchMyBookings();
      }
    } catch (err) {
      showToast("error", "ไม่สามารถรีเซ็ตผังที่นั่งได้");
    } finally {
      setIsResettingSeats(false);
    }
  };

  const availableSeatsCount = seats.filter((s) => s.status === "AVAILABLE").length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* 1. Header & Navigation */}
      <Navbar
        concerts={concerts}
        selectedConcertId={selectedConcertId}
        onSelectConcert={(id) => handleGoToSeatMap(id)}
        onOpenEngineDrawer={handleOpenEngineDrawer}
        onResetSeats={handleResetSeats}
        isResetting={isResettingSeats}
        currentView={currentView}
        onGoToCatalog={() => setCurrentView("catalog")}
        onGoToMyTickets={() => setCurrentView("mytickets")}
        myTicketsCount={myBookings.length}
      />

      {/* Toast Notification Float */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
          <div
            className={`p-4 rounded-2xl shadow-float border flex items-start space-x-3 backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-950"
                : toastMessage.type === "error"
                ? "bg-rose-50/95 border-rose-200 text-rose-950"
                : "bg-surface-soft/95 border-hairline text-ink"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toastMessage.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {toastMessage.text}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === "catalog" ? (
          /* ================= VIEW 1: DISCOVERY CATALOG (หน้าแรก) ================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConcertCatalog
              concerts={concerts}
              onSelectConcertToBook={(id) => handleGoToSeatMap(id)}
              onViewConcertDetails={(id) => handleViewConcertDetails(id)}
              onOpenEngineDrawer={handleOpenEngineDrawer}
            />
          </div>
        ) : currentView === "mytickets" ? (
          /* ================= VIEW: MY TICKETS (บัตรของฉัน) ================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MyTicketsView
              bookings={myBookings}
              concerts={concerts}
              onGoToCatalog={() => setCurrentView("catalog")}
              onSelectConcert={(id) => handleGoToSeatMap(id)}
            />
          </div>
        ) : currentView === "detail" ? (
          /* ================= VIEW 2: EVENT DETAIL VIEW (หน้ารายละเอียดและกติกา) ================= */
          currentConcert && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ConcertDetailView
                concert={currentConcert}
                onGoToSeatMap={() => handleGoToSeatMap()}
                onBackToCatalog={() => setCurrentView("catalog")}
                availableSeatsCount={availableSeatsCount}
                totalSeatsCount={seats.length}
              />
            </div>
          )
        ) : (
          /* ================= VIEW 3: SEAT SELECTION & RUSH ENGINE (หน้าผังที่นั่ง) ================= */
          currentConcert && (
            <div className="animate-fadeIn pb-24">
              {/* Back to Event Details Breadcrumb */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between">
                <button
                  onClick={() => setCurrentView("detail")}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors p-1 -ml-1 rounded-lg hover:bg-surface-soft"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ย้อนกลับไปหน้ารายละเอียดคอนเสิร์ต</span>
                </button>

                <button
                  onClick={() => setCurrentView("catalog")}
                  className="text-xs text-ink-muted hover:text-ink underline"
                >
                  เลือกคอนเสิร์ตอื่น
                </button>
              </div>

              {/* Concert Hero Banner */}
              <ConcertHero
                concert={currentConcert}
                availableCount={availableSeatsCount}
                totalSeats={seats.length}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Holding Timer Banner (If user has a held seat) */}
                {heldSeat && (
                  <HoldingTimerBanner
                    heldSeat={heldSeat}
                    onConfirmPayment={() => setIsCheckoutModalOpen(true)}
                    onReleaseSeat={handleReleaseSeat}
                    isConfirming={isProcessingCheckout}
                  />
                )}

                {/* Zone & Pricing Filter */}
                <ZoneSelector
                  zones={currentConcert.zones}
                  seats={seats}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
                />

                {/* Interactive Stage & Seat Grid */}
                <div className="mt-4">
                  <StageSeatGrid
                    seats={seats}
                    selectedSeatId={selectedSeat?.id || null}
                    onSelectSeat={handleSelectSeat}
                    selectedZoneId={selectedZoneId}
                    highlightSeatId={targetSeatId}
                  />
                </div>
              </div>

              {/* Bottom Sticky Booking Bar */}
              <BookingBar
                selectedSeat={selectedSeat}
                onHoldSeat={handleHoldSeat}
                isLoading={isHoldingSeat}
              />
            </div>
          )
        )}
      </main>

      {/* Official Platform Footer */}
      <Footer />

      {/* Attendee Checkout Modal (กรอกข้อมูลผู้เข้าชมและชำระเงิน) */}
      <AttendeeCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        seat={heldSeat}
        concert={currentConcert}
        onConfirmCheckout={handleConfirmCheckout}
        isProcessing={isProcessingCheckout}
      />

      {/* Slide-over Couchbase Engine Drawer */}
      <EngineDrawer
        isOpen={isEngineOpen}
        onClose={() => setIsEngineOpen(false)}
        targetSeat={targetSeat}
        casToken={latestCasToken}
        onSimulateRush={handleSimulateRush}
        isSimulating={isSimulatingRush}
        battleResult={battleResult}
        onResetSeats={handleResetSeats}
        isResetting={isResettingSeats}
        lastKvLatency={lastKvLatency}
        lastCasLatency={lastCasLatency}
        lastQueryLatency={lastQueryLatency}
      />

      {/* Success Digital Ticket Modal (E-Ticket ออกบัตรทางการ) */}
      <TicketSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        booking={completedBooking}
        concert={currentConcert}
        onViewMyTickets={() => {
          setIsSuccessModalOpen(false);
          setCurrentView("mytickets");
        }}
      />
    </div>
  );
}
