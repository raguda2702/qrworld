import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ ok: true, note: "Stripe webhook scaffold. Verify signature with live secret." });
}
