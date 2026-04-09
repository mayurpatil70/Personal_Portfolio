// WhatsApp Service for sending messages and storing client data
const WORKER_URL = import.meta.env.VITE_WORKER_URL;
const WHATSAPP_NUMBER = "+91 9689102662";

interface ClientFormData {
  name: string;
  email: string;
  whatsapp?: string;
  subject?: string;
  message: string;
  timestamp?: number;
  id?: string;
}

// Store client data in localStorage (backup storage)
export function storeClientData(formData: ClientFormData): string {
  const clientId = Math.random().toString(36).slice(2, 10);
  const clientDataWithId = { ...formData, id: clientId, timestamp: Date.now() };

  try {
    // Get existing clients
    const existingClients = JSON.parse(localStorage.getItem("clients") ?? "[]");
    existingClients.unshift(clientDataWithId);

    // Keep only last 100 submissions in localStorage
    if (existingClients.length > 100) {
      existingClients.pop();
    }

    localStorage.setItem("clients", JSON.stringify(existingClients));
    console.log("Client data stored:", clientId);
    return clientId;
  } catch (error) {
    console.error("Error storing client data:", error);
    return clientId;
  }
}

// Send WhatsApp message
export async function sendWhatsAppMessage(
  formData: ClientFormData,
): Promise<boolean> {
  if (!WORKER_URL) {
    console.warn("WORKER_URL not configured, WhatsApp message not sent");
    return false;
  }

  try {
    const message = formatWhatsAppMessage(formData);

    const res = await fetch(`${WORKER_URL}/whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: WHATSAPP_NUMBER,
        customerPhoneNumber: formData.whatsapp,
        customerName: formData.name,
        message: message,
        formData: formData,
      }),
    });

    if (!res.ok) {
      console.warn("WhatsApp message failed:", await res.text());
      return false;
    }

    console.log("WhatsApp message sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}

// Format message for WhatsApp (to owner)
function formatWhatsAppMessage(formData: ClientFormData): string {
  return (
    `📋 *New Client Inquiry*\n\n` +
    `👤 *Name:* ${formData.name}\n` +
    `📧 *Email:* ${formData.email}\n` +
    `${formData.whatsapp ? `📱 *WhatsApp:* ${formData.whatsapp}\n` : ""}` +
    `${formData.subject ? `💼 *Subject:* ${formData.subject}\n` : ""}` +
    `📝 *Message:*\n${formData.message}\n\n` +
    `⏰ *Time:* ${new Date().toLocaleString()}\n` +
    `🔗 *Reply to:* ${formData.email}`
  );
}

// Get all stored clients (for future dashboard)
export function getStoredClients(): ClientFormData[] {
  try {
    return JSON.parse(localStorage.getItem("clients") ?? "[]");
  } catch {
    return [];
  }
}

// Clear stored clients
export function clearStoredClients(): void {
  try {
    localStorage.removeItem("clients");
  } catch (error) {
    console.error("Error clearing clients:", error);
  }
}

// Export type
export type { ClientFormData };
