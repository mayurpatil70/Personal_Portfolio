/**
 * Cloudflare Worker / Backend Service for Portfolio
 * Handles Discord/WhatsApp notifications and thank you messages
 *
 * Setup:
 * 1. Deploy to Cloudflare Workers or your own backend
 * 2. Set environment variables:
 *    - DISCORD_WEBHOOK_URL
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_WHATSAPP_NUMBER (your business WhatsApp number)
 * 3. Update VITE_WORKER_URL in .env
 */

// Example for Cloudflare Workers (wrangler.toml)
/*
name = "portfolio-worker"
type = "javascript"
account_id = "your-account-id"
workers_dev = true
route = "your-custom-domain.com/*"
zone_id = "your-zone-id"

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.kv_namespaces]]
binding = "CLIENTS"
id = "your-kv-namespace-id"
*/

// Example implementation using Cloudflare Workers
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      // Discord notification endpoint
      if (path === "/discord" && request.method === "POST") {
        return await handleDiscord(request);
      }

      // WhatsApp notification endpoint
      if (path === "/whatsapp" && request.method === "POST") {
        return await handleWhatsApp(request);
      }

      // Thank you message endpoint
      if (path === "/thankyou" && request.method === "POST") {
        return await handleThankYou(request);
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

/**
 * Send Discord notification
 */
async function handleDiscord(request) {
  const { category, data } = await request.json();
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!DISCORD_WEBHOOK_URL) {
    return new Response(
      JSON.stringify({ ok: false, error: "Discord webhook not configured" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const embed = {
    title: `📧 ${category === "contact" ? "Contact Form" : "New Submission"}`,
    description: `New ${category} submission received`,
    fields: [
      { name: "Name", value: data.name || "N/A", inline: true },
      { name: "Email", value: data.email || "N/A", inline: true },
      { name: "Subject", value: data.subject || "N/A", inline: false },
      { name: "Message", value: data.message || "N/A", inline: false },
    ],
    color: 3447003,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return new Response(JSON.stringify({ ok: response.ok }), {
      status: response.ok ? 200 : 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Discord error:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Send WhatsApp message via Twilio
 */
async function handleWhatsApp(request) {
  const { phoneNumber, customerPhoneNumber, customerName, message, formData } =
    await request.json();

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_WHATSAPP_FROM =
    process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Twilio sandbox

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn("Twilio credentials not configured");
    return new Response(
      JSON.stringify({
        ok: true,
        message: "WhatsApp would be sent (not configured)",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const twilio_url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  try {
    // Send notification to owner
    const ownerResponse = await fetch(twilio_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: `whatsapp:${phoneNumber}`,
        Body: message,
      }).toString(),
    });

    const ownerResult = await ownerResponse.json();
    console.log("WhatsApp notification sent to owner:", ownerResult);

    // Send auto-reply to customer if WhatsApp number provided
    let customerNotified = false;
    if (customerPhoneNumber && customerName) {
      const autoReplyMessage =
        `Hello ${customerName}! 👋\n\n` +
        `Thanks for Contacting NoBallOnDesk! 🚀\n\n` +
        `We will connect with you as soon as possible.\n\n` +
        `Here is our WhatsApp/Calling no you can call directly:\n` +
        `📱 +91 9689102662\n\n` +
        `Looking forward to working with you! 💼`;

      const customerResponse = await fetch(twilio_url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_FROM,
          To: `whatsapp:${customerPhoneNumber}`,
          Body: autoReplyMessage,
        }).toString(),
      });

      const customerResult = await customerResponse.json();
      customerNotified = customerResponse.ok;
      console.log("WhatsApp auto-reply sent to customer:", customerResult);
    }

    return new Response(
      JSON.stringify({
        ok: ownerResponse.ok,
        sid: ownerResult.sid,
        ownerNotified: ownerResponse.ok,
        customerNotified: customerNotified,
      }),
      {
        status: ownerResponse.ok ? 200 : 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("WhatsApp error:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Generate and return thank you message
 */
async function handleThankYou(request) {
  const { name } = await request.json();

  const messages = [
    `Thanks ${name || "there"}! Your message is important to me. I'll review it and get back to you as soon as possible. 🚀`,
    `Hey ${name || "friend"}! Got your message! I'm excited to hear from you. Expect a reply soon! 💌`,
    `Thanks for reaching out, ${name || "awesome person"}! I'll be in touch within 24 hours. 🙌`,
    `Received your message, ${name || "colleague"}! Looking forward to discussing this with you. 📬`,
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  return new Response(JSON.stringify({ ok: true, message }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
