"use client";

import React, { useState, useEffect } from "react";
import { SeatDocument } from "@/validators/seat.schema";
import { ConcertDocument } from "@/validators/concert.schema";
import { X, Loader2, QrCode, CreditCard, ShieldCheck } from "lucide-react";

interface AttendeeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  seat: SeatDocument | null;
  concert: ConcertDocument | null;
  onConfirmCheckout: (attendeeData: {
    fullName: string;
    idCardLast4: string;
    phone: string;
    email: string;
    paymentMethod: "PROMPTPAY" | "CREDIT_CARD";
  }) => Promise<void>;
  isProcessing: boolean;
}

export const AttendeeCheckoutModal: React.FC<AttendeeCheckoutModalProps> = ({
  isOpen,
  onClose,
  seat,
  concert,
  onConfirmCheckout,
  isProcessing,
}) => {
  // Attendee Info (Always blank initially, no auto-fill)
  const [fullName, setFullName] = useState("");
  const [idCardLast4, setIdCardLast4] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PROMPTPAY" | "CREDIT_CARD">("PROMPTPAY");

  // Simulated Credit Card fields (if chosen)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Agreement checkbox
  const [isAgreed, setIsAgreed] = useState(false);

  // Holding countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);

  useEffect(() => {
    if (!isOpen || !seat?.heldUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(seat.heldUntil!).getTime() - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, seat?.heldUntil]);

  if (!isOpen || !seat || !concert) return null;

  const fee = 20;
  const totalPrice = seat.price + fee;

  const displayMin = Math.floor(secondsRemaining / 60);
  const displaySec = secondsRemaining % 60;
  const timeFormatted = `${String(displayMin).padStart(2, "0")}:${String(displaySec).padStart(2, "0")}`;

  // Card Number formatter (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Card Expiry formatter (MM/YY)
  const handleCardExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const isFormValid =
    fullName.trim().length >= 3 &&
    idCardLast4.trim().length === 4 &&
    phone.trim().length >= 9 &&
    email.includes("@") &&
    isAgreed &&
    (paymentMethod === "PROMPTPAY" ||
      (cardNumber.replace(/\s/g, "").length === 16 &&
        cardExpiry.length === 5 &&
        cardCvv.length === 3));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isProcessing || secondsRemaining <= 0) return;
    await onConfirmCheckout({
      fullName: fullName.trim(),
      idCardLast4: idCardLast4.trim(),
      phone: phone.trim(),
      email: email.trim(),
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop Dismiss Area */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card - Strictly constrained to viewport height (max-h-[90vh]) with flex-col */}
      <div className="relative bg-canvas border border-hairline rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-soft z-10">
        {/* Pinned Header */}
        <div className="p-4 sm:p-5 border-b border-hairline-soft flex items-center justify-between shrink-0 bg-canvas">
          <div className="pr-2 truncate">
            <h3 className="text-base font-semibold text-ink truncate">
              ยืนยันการจองและชำระเงิน
            </h3>
            <p className="text-xs text-ink-muted mt-0.5 truncate">
              {concert.title} • ที่นั่ง {seat.label} ({seat.zoneName})
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-mono font-medium text-ink bg-surface-soft px-2.5 py-1 rounded-full border border-hairline-soft">
              {timeFormatted}
            </span>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Layout: Scrollable Body + Pinned Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Section 1: Attendee Information */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                1. ข้อมูลผู้ถือบัตรคอนเสิร์ต
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-ink-muted block mb-1">
                    ชื่อ-นามสกุล (ตรงกับบัตรประชาชน) <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-ink-muted/50 text-sm focus:outline-none focus:border-ink focus:bg-canvas transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-ink-muted block mb-1">
                      เลขบัตร ปชช. 4 ตัวท้าย <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="ตัวเลข 4 หลักสุดท้าย"
                      value={idCardLast4}
                      onChange={(e) => setIdCardLast4(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-ink-muted/50 text-sm font-mono focus:outline-none focus:border-ink focus:bg-canvas transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-ink-muted block mb-1">
                      เบอร์โทรศัพท์มือถือ <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="หมายเลขโทรศัพท์ 10 หลัก"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-ink-muted/50 text-sm font-mono focus:outline-none focus:border-ink focus:bg-canvas transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-ink-muted block mb-1">
                    อีเมลสำหรับรับ E-Ticket <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ระบุที่อยู่อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-ink-muted/50 text-sm focus:outline-none focus:border-ink focus:bg-canvas transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="space-y-3 pt-3 border-t border-hairline-soft">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                2. ช่องทางชำระเงิน
              </span>

              {/* Toggle Tabs */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PROMPTPAY")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                    paymentMethod === "PROMPTPAY"
                      ? "border-ink bg-canvas shadow-xs"
                      : "border-hairline bg-surface-soft text-ink-muted hover:text-ink"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-medium block text-ink">พร้อมเพย์ (PromptPay)</span>
                    <span className="text-[10px] text-ink-muted">สแกน QR ผ่านแอปธนาคาร</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                    paymentMethod === "CREDIT_CARD"
                      ? "border-ink bg-canvas shadow-xs"
                      : "border-hairline bg-surface-soft text-ink-muted hover:text-ink"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-medium block text-ink">บัตรเครดิต / เดบิต</span>
                    <span className="text-[10px] text-ink-muted">Visa, Mastercard</span>
                  </div>
                </button>
              </div>

              {/* Payment Method Details */}
              {paymentMethod === "PROMPTPAY" ? (
                /* Simulated Thai PromptPay QR Box */
                <div className="p-4 rounded-xl border border-hairline-soft bg-surface-soft text-center space-y-3">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
                    <span>THAI QR PAYMENT</span>
                  </div>

                  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto bg-canvas border border-hairline rounded-xl p-2.5 flex items-center justify-center shadow-xs">
                    {/* Clean SVG QR Pattern Representation */}
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-6 h-6 border-2 border-ink rounded-xs p-0.5"><div className="w-full h-full bg-ink" /></div>
                        <div className="w-6 h-6 border-2 border-ink rounded-xs p-0.5"><div className="w-full h-full bg-ink" /></div>
                      </div>
                      <div className="flex justify-center items-center py-1">
                        <div className="text-[8px] font-mono font-bold tracking-widest text-ink">KAZETIX</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-6 h-6 border-2 border-ink rounded-xs p-0.5"><div className="w-full h-full bg-ink" /></div>
                        <div className="w-6 h-6 border border-hairline flex items-center justify-center">
                          <div className="w-2 h-2 bg-ink" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-ink-muted space-y-0.5">
                    <div className="font-mono text-ink font-semibold">
                      ยอดชำระ: ฿{totalPrice.toLocaleString()} บาท
                    </div>
                    <div className="text-[11px]">
                      Biller ID: 010556708819200 • Ref: KZ-{seat.label}
                    </div>
                    <div className="text-[10px] text-ink-muted/80">
                      (จำลองการชำระเงิน: กดปุ่มด้านล่างเพื่อยืนยันการตัดยอดสำเร็จทันที)
                    </div>
                  </div>
                </div>
              ) : (
                /* Simulated Credit Card Fields */
                <div className="p-4 rounded-xl border border-hairline-soft bg-surface-soft space-y-3 text-xs">
                  <div>
                    <label className="text-ink-muted block mb-1">หมายเลขบัตร 16 หลัก <span className="text-primary">*</span></label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-hairline bg-canvas font-mono text-ink text-sm focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-ink-muted block mb-1">วันหมดอายุ (MM/YY) <span className="text-primary">*</span></label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="ดด/ปป (MM/YY)"
                        value={cardExpiry}
                        onChange={(e) => handleCardExpiryChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-hairline bg-canvas font-mono text-ink text-sm focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="text-ink-muted block mb-1">รหัสความปลอดภัย (CVV) <span className="text-primary">*</span></label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3 py-2 rounded-lg border border-hairline bg-canvas font-mono text-ink text-sm focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-ink-muted flex items-center space-x-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ระบบจำลองการประมวลผลบัตรเครดิต ปลอดภัยด้วย CAS Token</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Order Summary */}
            <div className="p-4 rounded-xl bg-surface-soft border border-hairline-soft space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>ราคาบัตรที่นั่ง {seat.label} ({seat.zoneName})</span>
                <span className="font-mono text-ink">฿{seat.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>ค่าธรรมเนียมการออกตั๋วระบบ</span>
                <span className="font-mono text-ink">฿{fee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-hairline-soft flex justify-between font-semibold text-sm text-ink">
                <span>ยอดชำระสุทธิ</span>
                <span className="font-mono text-primary">฿{totalPrice.toLocaleString()} บาท</span>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-xs text-ink-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-hairline text-primary focus:ring-0 focus:outline-none"
                />
                <span className="leading-relaxed">
                  ข้าพเจ้ายอมรับข้อกำหนดและเงื่อนไขการจำหน่ายบัตร และยืนยันว่าชื่อ-นามสกุลตรงกับเอกสารยืนยันตัวตนที่จะนำไปแสดงในวันงาน
                </span>
              </label>
            </div>
          </div>

          {/* Pinned / Sticky Footer: Always fully visible without scrolling off-screen */}
          <div className="p-4 sm:p-5 border-t border-hairline-soft bg-canvas shrink-0">
            <button
              type="submit"
              disabled={!isFormValid || isProcessing || secondsRemaining <= 0}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-active text-canvas font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-float active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก Couchbase CAS...</span>
                </>
              ) : !fullName.trim() || idCardLast4.length !== 4 || phone.length < 9 || !email.includes("@") ? (
                <span>กรุณากรอกข้อมูลผู้เข้าชมให้ครบถ้วน</span>
              ) : !isAgreed ? (
                <span>กรุณากดยอมรับเงื่อนไขการจำหน่ายบัตร</span>
              ) : (
                <span>ยืนยันและชำระเงิน ฿{totalPrice.toLocaleString()} บาท</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
