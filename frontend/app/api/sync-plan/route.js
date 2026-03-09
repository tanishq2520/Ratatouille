import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * POST /api/sync-plan
 * Called by the client after a plan change to sync the subscriptionTier
 * in Strapi with the current Clerk subscription state.
 */
export async function POST() {
  try {
    const { userId, has } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Re-read the current plan directly from Clerk (source of truth)
    const isPro = has({ plan: "pro" });
    const subscriptionTier = isPro ? "pro" : "free";

    // Find the user in Strapi
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!searchResponse.ok) {
      console.error("Failed to find user in Strapi:", await searchResponse.text());
      return NextResponse.json(
        { error: "Failed to find user" },
        { status: 500 }
      );
    }

    const userData = await searchResponse.json();

    if (!userData || userData.length === 0) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const strapiUser = userData[0];

    // Only update if the tier actually changed
    if (strapiUser.subscriptionTier === subscriptionTier) {
      console.log(`ℹ️ Plan already synced: ${subscriptionTier}`);
      return NextResponse.json({
        success: true,
        subscriptionTier,
        changed: false,
      });
    }

    // Update subscription tier in Strapi
    const updateResponse = await fetch(
      `${STRAPI_URL}/api/users/${strapiUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ subscriptionTier }),
      }
    );

    if (!updateResponse.ok) {
      console.error("Failed to update plan in Strapi:", await updateResponse.text());
      return NextResponse.json(
        { error: "Failed to update plan" },
        { status: 500 }
      );
    }

    console.log(`✅ Plan synced for user ${userId}: ${subscriptionTier}`);

    return NextResponse.json({
      success: true,
      subscriptionTier,
      changed: true,
    });
  } catch (error) {
    console.error("❌ Error syncing plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
