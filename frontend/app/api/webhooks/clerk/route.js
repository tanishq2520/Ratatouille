import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/clerk
 * Handles Clerk webhook events for user and subscription changes.
 * Set this URL in your Clerk Dashboard → Webhooks.
 * Subscribe to events: user.updated, user.created
 */
export async function POST(req) {
  if (!CLERK_WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Verify the webhook signature
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;
  console.log(`📨 Clerk webhook received: ${type}`);

  // Handle user.updated — re-sync subscription tier
  if (type === "user.updated" || type === "user.created") {
    const clerkId = data.id;

    // Determine tier from Clerk's public metadata (set by Clerk Billing)
    // Clerk sets publicMetadata.plan = "pro" for paid subscribers
    const plan = data.public_metadata?.plan;
    const subscriptionTier = plan === "pro" ? "pro" : "free";

    try {
      // Find user in Strapi
      const searchResponse = await fetch(
        `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkId}`,
        {
          headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
          cache: "no-store",
        }
      );

      if (!searchResponse.ok) {
        console.error("Failed to find user in Strapi for webhook");
        return NextResponse.json({ error: "Strapi lookup failed" }, { status: 500 });
      }

      const users = await searchResponse.json();
      if (!users || users.length === 0) {
        // User might not be in Strapi yet (race condition) — not an error
        console.log(`ℹ️ User ${clerkId} not in Strapi yet, skipping sync`);
        return NextResponse.json({ success: true, skipped: true });
      }

      const strapiUser = users[0];

      // Update subscriptionTier in Strapi only if changed
      if (strapiUser.subscriptionTier !== subscriptionTier) {
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
          console.error("Failed to update user plan in Strapi:", await updateResponse.text());
          return NextResponse.json({ error: "Strapi update failed" }, { status: 500 });
        }

        console.log(`✅ Webhook: updated ${clerkId} → ${subscriptionTier}`);
      } else {
        console.log(`ℹ️ Webhook: ${clerkId} already ${subscriptionTier}, no change`);
      }
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
