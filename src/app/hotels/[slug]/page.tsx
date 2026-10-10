import { notFound } from "next/navigation";
import { HotelDetails } from "@/components/hotel-details";
import { hotels, getHotel } from "@/lib/hotels";

export function generateStaticParams() { return hotels.map(({ slug }) => ({ slug })); }
export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) notFound();
  return <HotelDetails hotel={hotel}/>;
}
