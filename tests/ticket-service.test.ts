import { describe, it, expect, beforeEach } from "vitest";
import { ticketService } from "@/services/ticket.service";
import { seatRepository } from "@/repositories/seat.repository";

describe("Ticket Rush Engine & CAS Concurrency Protection", () => {
  const concertId = "fujii-kaze-bkk";
  const targetSeatId = `seat::${concertId}::VIP-01`;

  beforeEach(async () => {
    // Reset seed data before each test
    await seatRepository.resetSeats();
  });

  it("should successfully hold an available seat with atomic CAS", async () => {
    const result = await ticketService.holdSeatWithCas(
      targetSeatId,
      "USER-TEST-01",
      "คุณสมชาย แฟนพันธุ์แท้"
    );

    expect(result.seat.status).toBe("HELD");
    expect(result.seat.heldBy).toBe("USER-TEST-01");
    expect(result.seat.heldUntil).toBeTruthy();
    expect(result.cas).toBeTruthy();
    expect(result.durationMs).toBeGreaterThan(0);
  });

  it("should prevent double booking when two users compete with same CAS token", async () => {
    // First user locks it
    await ticketService.holdSeatWithCas(targetSeatId, "USER-A", "แฟนคลับ A");

    // Second user tries to lock the same seat
    await expect(
      ticketService.holdSeatWithCas(targetSeatId, "USER-B", "แฟนคลับ B")
    ).rejects.toThrow(/SEAT_ALREADY_TAKEN|CAS_MISMATCH/);
  });

  it("should handle 20 concurrent fan rush requests with EXACTLY 1 winner and ZERO overselling", async () => {
    const battle = await ticketService.simulateRushBattle(targetSeatId, 20);

    expect(battle.totalRequesters).toBe(20);
    expect(battle.successfulCount).toBe(1);
    expect(battle.rejectedCount).toBe(19);
    expect(battle.winner).toBeTruthy();
    expect(battle.safetyStatus).toBe("PERFECT_CAS_PROTECTION");
    expect(battle.finalSeatStatus.status).toBe("HELD");
    expect(battle.finalSeatStatus.heldBy).toBe(battle.winner);
  });

  it("should allow releasing a held seat back to AVAILABLE status", async () => {
    await ticketService.holdSeatWithCas(targetSeatId, "USER-A", "แฟนคลับ A");
    const released = await ticketService.releaseHold(targetSeatId, "USER-A");

    expect(released.status).toBe("AVAILABLE");
    expect(released.heldBy).toBeNull();

    // Now another user can hold it
    const nextHold = await ticketService.holdSeatWithCas(targetSeatId, "USER-B", "แฟนคลับ B");
    expect(nextHold.seat.status).toBe("HELD");
    expect(nextHold.seat.heldBy).toBe("USER-B");
  });

  it("should finalize booking when confirming payment for a held seat", async () => {
    await ticketService.holdSeatWithCas(targetSeatId, "USER-PAY-01", "ผู้ซื้อตัวจริง");
    const confirmed = await ticketService.confirmPayment(
      targetSeatId,
      "USER-PAY-01",
      "ผู้ซื้อตัวจริง"
    );

    expect(confirmed.seat.status).toBe("BOOKED");
    expect(confirmed.booking.paymentStatus).toBe("PAID");
    expect(confirmed.booking.seatLabel).toBe("VIP-01");
  });
});
