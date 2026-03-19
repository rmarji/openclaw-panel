import { NextRequest, NextResponse } from "next/server";
import { activeCoupons } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const { code, tier } = await req.json();

  if (!code) {
    return NextResponse.json({ valid: false, error: "No coupon code" });
  }

  const coupon = activeCoupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return NextResponse.json({ valid: false, error: "Invalid coupon code" });
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" });
  }

  if (
    coupon.applicableTiers &&
    coupon.applicableTiers.length > 0 &&
    tier &&
    !coupon.applicableTiers.includes(tier)
  ) {
    return NextResponse.json({
      valid: false,
      error: `This coupon is not available for the ${tier} plan`,
    });
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      percentOff: coupon.percentOff,
      amountOff: coupon.amountOff,
      duration: coupon.duration,
      durationInMonths: coupon.durationInMonths,
    },
  });
}
