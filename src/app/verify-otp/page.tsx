/**
 * /verify-otp is kept as a redirect for any old links that may exist.
 * The OTP flow has been replaced with the email-link verification flow.
 * Visitors are redirected to the verify-email waiting page.
 */
import { redirect } from "next/navigation";

export default function VerifyOtpRedirectPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams?.email || "";
  redirect(email ? `/auth/verify-email?email=${encodeURIComponent(email)}` : "/auth/verify-email");
}
