import { NextResponse } from "next/server";
import { AdminAnalyticsService } from "@/services/adminAnalyticsService";

export async function GET(request: Request) {
  try {
    const metrics = await AdminAnalyticsService.getAnalyticsMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
