# WhatsApp Integration Setup Guide

## Overview

This guide helps you set up WhatsApp webhook integration so that:

1. **Form submissions are sent to your WhatsApp** (+91 9689102662)
2. **Automatic replies are sent to customers** with your contact information

## System Architecture

```
Customer fills form
    ↓
Form data collected in browser
    ↓
Frontend sends to Backend Worker
    ↓
Backend uses Twilio to send:
  - Notification to your WhatsApp (+91 9689102662)
  - Auto-reply to customer's WhatsApp (if provided)
```

## Step-by-Step Setup

### 1. Create Twilio Account

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for a free account
3. Verify your phone number

### 2. Set Up WhatsApp in Twilio

1. Go to **Console → Messaging → Try it out → Send a WhatsApp message**
2. Accept the WhatsApp Business terms and conditions
3. You'll get a **Twilio WhatsApp Sandbox Number** (e.g., `+14155238886`)
4. Follow instructions to create a sandbox connection with a test message

### 3. Get Twilio API Credentials

1. Click on **Account** (top left) → **API Keys & tokens**
2. Copy your **Account SID** and **Auth Token**
3. Keep these safe (never commit to git)

### 4. Configure Your Business WhatsApp Number

1. In Twilio Console, go to **Messaging → WhatsApp → Senders**
2. Click **Create new sender** to connect your real business WhatsApp
3. Verify your business number and get approval from Meta (WhatsApp)
4. Once approved, you'll see your approved number with format: `whatsapp:+91XXXXXXXXXX`
5. Update `TWILIO_WHATSAPP_FROM` in your backend environment variables

### 5. Deploy Backend Worker

#### Option A: Using Cloudflare Workers (Recommended)

1. Sign up at [https://workers.cloudflare.com/](https://workers.cloudflare.com/)
2. Clone or copy the `backend-worker-example.js` to your Cloudflare Worker
3. Add environment variables in Cloudflare dashboard:
   ```
   TWILIO_ACCOUNT_SID = your_account_sid
   TWILIO_AUTH_TOKEN = your_auth_token
   TWILIO_WHATSAPP_FROM = whatsapp:+91XXXXXXXXXX
   DISCORD_WEBHOOK_URL = (optional)
   ```
4. Deploy the worker
5. Copy your worker URL (e.g., `https://portfolio-worker.yourname.workers.dev`)

#### Option B: Using Node.js/Express Server

1. Create a Node.js backend:

   ```bash
   npm install express cors twilio
   ```

2. Create `server.js`:

   ```javascript
   const express = require("express");
   const { MessagingResponse } = require("twilio");
   const app = express();

   app.use(express.json());
   app.use(express.urlencoded({ extended: false }));

   // Enable CORS
   app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
     res.header("Access-Control-Allow-Headers", "Content-Type");
     next();
   });

   // Handle OPTIONS
   app.options("*", (req, res) => res.sendStatus(200));

   // WhatsApp endpoint
   app.post("/whatsapp", require("./endpoints/whatsapp"));

   // Discord endpoint
   app.post("/discord", require("./endpoints/discord"));

   // Thank you endpoint
   app.post("/thankyou", require("./endpoints/thankyou"));

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. Deploy to Heroku, Railway, or Render
4. Update `VITE_WORKER_URL` with your server URL

### 6. Update Frontend Configuration

1. Copy `.env.example` to `.env.local`
2. Update `VITE_WORKER_URL`:
   ```
   VITE_WORKER_URL=https://your-worker-url.com
   ```

### 7. Test the Integration

1. Fill out the contact form with:
   - Name: Your name
   - Email: your@email.com
   - **WhatsApp: +91 9876543210** (your WhatsApp number)
   - Subject: Test
   - Message: This is a test message

2. Submit the form

3. Check:
   - ✅ You receive a notification on WhatsApp (+91 9689102662)
   - ✅ Customer receives auto-reply on their WhatsApp number
   - ✅ Form data appears in browser's local storage (see DevTools → Application)

## What Gets Sent

### To Owner (+91 9689102662)

```
📋 *New Client Inquiry*

👤 *Name:* John Doe
📧 *Email:* john@example.com
📱 *WhatsApp:* +91 9876543210
💼 *Subject:* Project Collaboration
📝 *Message:*
Looking for collaboration on a web project

⏰ *Time:* 4/9/2026, 2:30:45 PM
🔗 *Reply to:* john@example.com
```

### To Customer (if WhatsApp provided)

```
Hello John Doe! 👋

Thanks for Contacting NoBallOnDesk! 🚀

We will connect with you as soon as possible.

Here is our WhatsApp/Calling no you can call directly:
📱 +91 9689102662

Looking forward to working with you! 💼
```

## Client Data Storage

Form submissions are automatically stored in:

1. **Browser localStorage** - Last 100 submissions
2. **Backend database** (if you set up)
3. **Your WhatsApp** - As message notifications

To view stored clients in browser:

```javascript
// In browser console
JSON.parse(localStorage.getItem("clients"));
```

## Environment Variables Reference

### Frontend (.env.local)

```
VITE_WORKER_URL=https://your-worker-url.com
```

### Backend (Cloudflare Worker or Node.js .env)

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+91XXXXXXXXXX
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## Troubleshooting

### Issue: WhatsApp messages not received

**Solution:**

- Verify Twilio Account SID and Auth Token are correct
- Ensure WhatsApp number is in correct format: `+91...` not `91...`
- Check Twilio console for any error messages
- Test with Twilio's WhatsApp sandbox first

### Issue: Auto-reply not sent

**Solution:**

- Ensure customer provides WhatsApp number in form
- Check number format: should include country code (+91)
- Verify number is a valid WhatsApp account
- Check backend logs for errors

### Issue: Form data not storing

**Solution:**

- Check browser console for JavaScript errors
- Verify localStorage is enabled
- Check browser DevTools → Application → Local Storage

### Issue: Backend not responding

**Solution:**

- Verify `VITE_WORKER_URL` is correct and accessible
- Check CORS headers are enabled on backend
- Test endpoint with curl/Postman first
- Check backend logs/console for errors

## Security Best Practices

1. **Never commit credentials** - Use environment variables only
2. **Rotate Twilio tokens** - Regularly update auth tokens
3. **Validate phone numbers** - Ensure format before sending
4. **Rate limit** - Add rate limiting to prevent abuse
5. **HTTPS only** - Always use HTTPS for API calls
6. **Sanitize input** - Clean user input before storing

## Upgrading from Sandbox

When you're ready for production:

1. **Get approved for WhatsApp Business API:**
   - Submit business verification through Meta
   - Wait for approval (can take 5-7 days)

2. **Move from sandbox to production number:**
   - Use your real business WhatsApp number
   - Update `TWILIO_WHATSAPP_FROM` in backend

3. **Increase Twilio limits:**
   - Request higher message throughput
   - Set up proper error handling and retry logic

## Alternative: Use WhatsApp Business API Directly

Instead of Twilio, you can use WhatsApp Business API:

1. Get approved with Meta
2. Create custom webhook handler
3. Update backend to send directly to WhatsApp API

See [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

## Support

For issues:

1. Check Twilio status page: https://status.twilio.com/
2. Review Twilio documentation: https://www.twilio.com/docs/whatsapp
3. Check browser console for error messages
4. Enable debug logging in backend

---

**Happy messaging! 🚀** Your portfolio now automatically notifies you of customer inquiries on WhatsApp.
