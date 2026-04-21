import { WHATSAPP_NUMBER } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Vivek's%20Farm!%20I'd%20like%20to%20know%20more%20about%20your%20products.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};
