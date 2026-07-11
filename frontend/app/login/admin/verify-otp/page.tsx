"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const OTP_LENGTH = 6;

export default function AdminVerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown timer ──
  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Handle digit input ──
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1); // one digit per box
    setOtp(updated);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ── Handle backspace ──
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Handle paste ──
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Submit OTP ──
  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    const email =
      localStorage.getItem("pendingEmail") ||
      sessionStorage.getItem("pendingEmail");
    if (!email) {
      toast.error("Session expired. Please use Resend OTP.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify-otp`, {
        email,
        otp: otpCode,
      });

      toast.success("Account verified successfully!");
      localStorage.removeItem("pendingEmail");

      setTimeout(() => router.push("/login/admin"), 1500);
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : msg || "Invalid or expired OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    try {
      setResendLoading(true);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/resend-otp`);

      toast.success("OTP sent to your registered email");
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-100">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Verify OTP
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* OTP input boxes */}
              <div className="mb-6 flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold text-slate-900 outline-none transition focus:ring-2
                      ${digit
                        ? "border-green-500 bg-green-50 focus:ring-green-100"
                        : "border-gray-200 bg-white focus:border-green-500 focus:ring-green-100"
                      }`}
                  />
                ))}
              </div>

              {/* Countdown / Resend */}
              <div className="mb-6 text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-sm font-semibold text-green-600 transition hover:text-green-700 hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Sending…" : "Resend OTP"}
                  </button>
                ) : (
                  <p className="text-sm text-gray-400">
                    Resend code in{" "}
                    <span className="font-semibold text-green-600">
                      {countdown}s
                    </span>
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !isComplete}
                className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Verifying…
                  </span>
                ) : (
                  "VERIFY OTP"
                )}
              </button>

              {/* Back to login */}
              <p className="mt-5 text-center text-sm text-gray-500">
                Wrong account?{" "}
                <span
                  onClick={() => router.push("/login/admin")}
                  className="cursor-pointer font-semibold text-green-600 transition hover:text-green-700 hover:underline"
                >
                  Back to Login
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        containerStyle={{ top: 100, right: 20 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #d1d5db",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          },
          success: {
            style: { border: "1px solid #22c55e" },
            iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
          },
          error: {
            style: { border: "1px solid #ef4444" },
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          },
        }}
      />
    </>
  );
}
