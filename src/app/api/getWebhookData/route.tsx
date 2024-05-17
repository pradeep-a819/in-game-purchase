import { NextRequest, NextResponse } from "next/server";
import { getWebhookData } from "../../../lib/webhookDataStore";

export async function GET(request: NextRequest) {
  try {
    const data = getWebhookData();
    console.log(data)
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching webhook data:", error);
    return NextResponse.json(
      { message: "Error fetching webhook data" },
      { status: 500 }
    );
  }
}
