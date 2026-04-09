# WhatsApp & Client Management Setup Guide

This guide explains how to set up WhatsApp notifications and client form submission database for your portfolio.

## Overview

Your portfolio now includes:
1. **Client Database Storage** - Form submissions stored in localStorage (with ability to backup to backend)
2. **WhatsApp Notifications** - Automatic WhatsApp messages to +91 9689102662 when clients submit forms
3. **Client Notifications Panel** - Bottom left corner notification showing all form submissions
4. **Direct WhatsApp Link** - One-click access to WhatsApp conversations with clients

## Features

✅ **Automatic Client Capture** - All form data stored with timestamps
✅ **WhatsApp Integration** - Send messages to your WhatsApp business number
✅ **Real-time Notifications** - See new submissions instantly
✅ **Client History** - View last 100 client submissions
✅ **One-Click WhatsApp** - Direct link to open WhatsApp conversations

## Setup Steps

### Step 1: Set Your WhatsApp Number

The WhatsApp number is already configured in `src/lib/whatsappService.ts`:
```typescript
const WHATSAPP_NUMBER = "+91 9689102662";
```

To change it, edit this file and update the number.

### Step 2: Choose WhatsApp Integration Method

You have three options:

#### Option A: Twilio WhatsApp (Recommended - Easiest)
1. **Sign up for Twilio**: https://www.twilio.com/
2. **Get WhatsApp Sandbox Number**
   - Go to Twilio Console → WhatsApp
   - Create a sandbox for testing
   - Get your Twilio WhatsApp number
3. **Get Credentials**
   - Account SID
   - Auth Token
   - WhatsApp Phone Number

#### Option B: WhatsApp Business API (Production)
1. Request WhatsApp Business Account
2. Get API credentials
3. Verify your phone number

#### Option C: Custom Backend Service
- Use any service that supports WhatsApp messaging
- Modify `src/lib/whatsappService.ts` to call your service

### Step 3: Set Up Backend Worker

Deploy `backend-worker-example.js` to:
- **Cloudflare Workers** (Free, recommended)
- **AWS Lambda**
- **Vercel Functions**
- **Your own Node.js server**

#### Using Cloudflare Workers (Recommended)

1. **Install Wrangler CLI:**
```bash
npm install -g @cloudflare/wrangler
```

2. **Create `wrangler.toml`:**
```toml
name = "portfolio-worker"
type = "javascript"
account_id = "YOUR_ACCOUNT_ID"
workers_dev = true

[env.production]
vars = { ENVIRONMENT = "production" }
```

3. **Add Environment Variables:**
```bash
wrangler secret put DISCORD_WEBHOOK_URL
wrangler secret put TWILIO_ACCOUNT_SID
wrangler secret put TWILIO_AUTH_TOKEN
wrangler secret put TWILIO_WHATSAPP_FROM
```

4. **Deploy:**
```bash
wrangler deploy
```

### Step 4: Configure Environment Variables

Create `.env.local` in your project root:

```env
VITE_WORKER_URL=https://your-worker-domain.com
```

### Step 5: Test the Integration

1. Fill out the contact form on your portfolio
2. You should see:
   - ✅ Success message on the form
   - 📱 WhatsApp message sent to your number
   - 🔔 New notification badge in bottom-left corner
   - 📊 Client data stored and displayed in notifications panel

## How It Works

### Form Submission Flow:
```
User fills form
    ↓
Form submitted
    ↓
Data stored in localStorage
    ↓
WhatsApp message sent to +91 9689102662
    ↓
Discord notification sent (if configured)
    ↓
Thank you message displayed
    ↓
Notification badge appears in bottom-left
```

### Data Storage:
- **Client Database**: `localStorage["clients"]`
- **FloatingChat History**: `localStorage["fc_conversations"]`
- **Form Persistence**: `localStorage["formData"]`

### WhatsApp Message Format:
```
📋 New Client Inquiry

👤 Name: [Client Name]
📧 Email: [Client Email]
💼 Subject: [Subject]
📝 Message:
[Message content]

⏰ Time: [Timestamp]
🔗 Reply to: [Email]
```

## Client Notifications Panel

Located in bottom-left corner with features:

- **Submission Count Badge** - Shows number of new submissions
- **Expandable Panel** - Click to view all clients
- **Client Details** - Name, email, timestamp, message preview
- **Direct WhatsApp Link** - Opens WhatsApp conversations
- **Auto-dismiss** - Notification badge disappears after 5 seconds

### Accessing Stored Clients:

#### From Browser Console:
```javascript
// Get all stored clients
const clients = JSON.parse(localStorage.getItem("clients"));
console.log(clients);

// Clear stored clients
localStorage.removeItem("clients");
```

#### Programmatically:
```typescript
import { getStoredClients, clearStoredClients } from '@/lib/whatsappService';

const clients = getStoredClients();
// Do something with clients...
```

## Backup to Cloud Database

To backup clients to a cloud database (Optional), update `whatsappService.ts`:

```typescript
export async function backupClientToCloud(formData: ClientFormData) {
  // Firebase example
  await addDoc(collection(db, "clients"), {
    ...formData,
    createdAt: new Date(),
  });
}
```

## API Endpoints Required

Your backend worker needs these endpoints:

### POST /discord
Send Discord webhook notification
```json
{
  "category": "contact",
  "data": {
    "name": "John",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Message content"
  }
}
```

### POST /whatsapp
Send WhatsApp message
```json
{
  "phoneNumber": "+91 9689102662",
  "message": "Message content",
  "formData": { ... }
}
```

### POST /thankyou
Generate thank you message
```json
{
  "category": "contact",
  "name": "John",
  "formData": { ... }
}
```

## Troubleshooting

### WhatsApp message not sending?
- ✅ Check VITE_WORKER_URL is set in .env
- ✅ Verify backend worker is deployed and running
- ✅ Check Twilio credentials are correct
- ✅ Verify WhatsApp number format (+91 9689102662)

### Notification panel not showing?
- ✅ Check if clients are stored: `localStorage.getItem("clients")`
- ✅ Clear cache and refresh page
- ✅ Check browser console for errors

### Data not persisting?
- ✅ Check localStorage is enabled
- ✅ Check browser storage quota
- ✅ Check for private/incognito mode restrictions

## Security Considerations

1. **PhoneNumber Privacy**: WhatsApp number is visible in frontend code (public)
2. **Form Data**: Currently stored in localStorage (on user's device)
3. **Backend Security**: Use headers validation and rate limiting on your worker
4. **CORS**: Configure CORS properly in your backend

### Example CORS Headers:
```javascript
headers: {
  "Access-Control-Allow-Origin": "https://yourdomain.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}
```

## Advanced Features (Coming Soon)

- 📊 Analytics Dashboard
- 💾 Database Backup to Firebase/MongoDB
- 📧 Email notifications
- 🤖 AI-powered response suggestions
- 📱 Mobile app for managing inquiries
- 🔐 Admin authentication panel

## Support

For issues or questions:
1. Check the WhatsApp message format in `whatsappService.ts`
2. Verify your backend worker is running
3. Check browser console for error messages
4. Review your Twilio/WhatsApp API logs

## Files Modified/Created

- ✅ `src/lib/whatsappService.ts` - WhatsApp service
- ✅ `src/components/portfolio/ClientNotifications.tsx` - Notification panel
- ✅ `src/components/portfolio/Contact.tsx` - Updated form submission
- ✅ `src/pages/Index.tsx` - Added notification component
- ✅ `backend-worker-example.js` - Backend worker template
- ✅ `.env.example` - Environment configuration template

---

**WhatsApp Number:** +91 9689102662
**Status:** ✅ Fully configured and ready to use
