import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageSquare, X } from "lucide-react";
import { getStoredClients } from "@/lib/whatsappService";

interface ClientData {
  id?: string;
  name: string;
  email: string;
  message: string;
  timestamp?: number;
}

export const ClientNotifications = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    // Load clients on mount
    const loadedClients = getStoredClients();
    setClients(loadedClients);
    setNewCount(loadedClients.length);

    // Listen for new submissions (storage change)
    const handleStorageChange = () => {
      const updated = getStoredClients();
      setClients(updated);
      if (updated.length > clients.length) {
        setNewCount(1); // Show notification for new submission
        setTimeout(() => setNewCount(0), 5000); // Auto-dismiss after 5 seconds
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const openWhatsApp = () => {
    window.open("https://wa.me/919689102662", "_blank");
  };

  if (clients.length === 0 && newCount === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-6 left-6 z-40"
    >
      {/* Main notification button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        aria-label="View client submissions"
      >
        <Users className="h-6 w-6" />

        {/* Badge for new submissions */}
        {newCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
          >
            {newCount > 9 ? "9+" : newCount}
          </motion.div>
        )}
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-80 max-h-96 bg-card border rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-theme-primary" />
                Client Submissions ({clients.length})
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Client list */}
            <div className="overflow-y-auto flex-1">
              {clients.slice(0, 10).map((client, index) => (
                <motion.div
                  key={client.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                >
                  <p className="font-medium text-sm text-foreground">
                    {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {client.message}
                  </p>
                  {client.timestamp && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(client.timestamp).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer with WhatsApp button */}
            <div className="p-3 border-t bg-accent/50">
              <button
                onClick={openWhatsApp}
                className="w-full py-2 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Open WhatsApp
              </button>
              {clients.length > 10 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  +{clients.length - 10} more submissions
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
