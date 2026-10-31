import { cookies } from "next/headers";
import { getOrder, PAYMENT_COOKIE, paidBookingConfigured, proofMatches } from "./consultancy-payments";
import { sameOriginRequest } from "./booking";
export async function authorisedOrder(request: Request) {
  if (!paidBookingConfigured()) throw new Error("PAYMENTS_UNAVAILABLE");
  if (!sameOriginRequest(request)) throw new Error("UNAUTHORISED");
  const id = new URL(request.url).searchParams.get("order") || "";
  const order = await getOrder(id);
  const cookie = (await cookies()).get(PAYMENT_COOKIE)?.value || "";
  if (!order || !proofMatches(order, cookie)) throw new Error("UNAUTHORISED");
  return order;
}
export function publicPaymentError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHORISED") return { error: "Use the same browser used for payment, or contact OMNeXa with your receipt.", status: 401 };
  if (message === "PAYMENT_NOT_VERIFIED") return { error: "Payment is not yet verified. No appointment has been booked. Try again or contact OMNeXa.", status: 402 };
  if (message === "PAYMENT_REVERSED") return { error: "This payment cannot authorise a booking. Please contact OMNeXa.", status: 402 };
  if (message === "BOOKING_IN_PROGRESS") return { error: "Your booking is being confirmed. Please wait a moment, then reload; do not pay again.", status: 409 };
  if (message === "SLOT_TAKEN") return { error: "That time is no longer available. Choose another time.", status: 409 };
  if (message === "ORDER_ALREADY_RESERVED") return { error: "This payment already has a booking in progress. Please reload to view it, or contact OMNeXa.", status: 409 };
  return { error: "Online payment or scheduling is temporarily unavailable. Please contact OMNeXa; do not pay again.", status: 503 };
}
