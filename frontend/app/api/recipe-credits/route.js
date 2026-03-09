import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { freeRecipeGeneration } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET() {
  try {
    const { userId, has } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPro = has({ plan: "pro" });

    // Pro users have unlimited access — no credit tracking
    if (isPro) {
      return NextResponse.json({
        isPro: true,
        tokensRemaining: null,
        capacity: null,
      });
    }

    // Peek remaining tokens by requesting 0 — this doesn't consume any tokens
    const req = await request();
    const decision = await freeRecipeGeneration.protect(req, {
      userId: userId,
      requested: 0,
    });

    // Extract remaining from the decision
    // When requesting 0, the decision is always allowed; we read the remaining count
    let tokensRemaining = 5; // default to full if we can't read

    if (decision.results && decision.results.length > 0) {
      for (const result of decision.results) {
        if (result.reason?.isRateLimit?.()) {
          tokensRemaining = Math.max(0, result.reason.remaining ?? 5);
          break;
        }
      }
    }

    return NextResponse.json({
      isPro: false,
      tokensRemaining,
      capacity: 5,
    });
  } catch (error) {
    console.error("❌ Error fetching recipe credits:", error);
    // Fail open — show full credits on error to avoid blocking users
    return NextResponse.json({
      isPro: false,
      tokensRemaining: 5,
      capacity: 5,
    });
  }
}
