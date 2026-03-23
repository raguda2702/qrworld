import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ ok: true, note: "Stripe checkout scaffold. Add live secrets to enable." });
}
