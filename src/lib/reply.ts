export function buildWhatsAppUrl(message: string, phoneNumber = ""): string {
  const safeNumber = phoneNumber.replace(/\D/g, "");
  const recipient = safeNumber ? `/${safeNumber}` : "/";
  return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
}
