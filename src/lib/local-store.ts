"use client";

export type Booking = {
  id: string; hotelSlug: string; hotelName: string; roomId: string; roomName: string; guestName: string;
  email: string; phone: string; checkIn: string; checkOut: string; guests: number;
  rooms: number; notes: string; base: number; serviceFee: number; tax: number; total: number; createdAt: string;
};
export type ChatMessage = { id: string; text: string; createdAt: string; status: "saved-locally" };

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch (error) {
    console.error(`Could not read local demo data "${key}".`, error);
    return fallback;
  }
}
function write<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (error) { console.error(`Could not save local demo data "${key}".`, error); throw error; }
}

export const getFavorites = () => read<string[]>("quickstay:favorites", []);
export const toggleFavorite = (slug: string) => {
  const favorites = getFavorites();
  const updated = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
  write("quickstay:favorites", updated);
  return updated;
};
export const getBookings = () => read<Booking[]>("quickstay:bookings", []);
export const saveBooking = (booking: Booking) => {
  const bookings = [booking, ...getBookings()];
  write("quickstay:bookings", bookings);
  return booking;
};
export const getMessages = () => read<ChatMessage[]>("quickstay:chat", []);
export const saveMessage = (text: string) => {
  const messages = [...getMessages(), { id: crypto.randomUUID(), text, createdAt: new Date().toISOString(), status: "saved-locally" as const }];
  write("quickstay:chat", messages);
  return messages;
};
