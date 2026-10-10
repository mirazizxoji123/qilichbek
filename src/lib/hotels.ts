export type Room = { id: string; name: string; description: string; price: number; guests: number; bed: string };
export type Hotel = {
  id: string; slug: string; name: string; city: string; country: string; category: string;
  description: string; image: string; images: string[]; amenities: string[]; rating: number;
  reviews: number; price: number; currency: string; stars: number; capacity: number;
  checkIn: string; checkOut: string; cancellation: string; featured: boolean;
  availability: { demoOnly: true; sampleRooms: number }; rooms: Room[];
};

const photos = {
  tashkent: "/stays/tashkent.jpg",
  samarkand: "/stays/samarkand.jpg",
  bukhara: "/stays/bukhara.jpg",
  beach: "/stays/coast.jpg",
  mountain: "/stays/mountain.jpg",
  villa: "/stays/villa.jpg",
  boutique: "/stays/boutique.jpg",
  apartment: "/stays/apartment.jpg",
  camp: "/stays/camp.jpg",
  interior: "/stays/interior.jpg",
  coast: "/stays/coast.jpg",
  resort: "/stays/resort.jpg",
  city: "/stays/city.jpg",
  room: "/stays/room.jpg",
  pool: "/stays/pool.jpg",
  nature: "/stays/nature.jpg",
  architecture: "/stays/architecture.jpg",
  dining: "/stays/dining.jpg",
  luxury: "/stays/luxury.jpg",
  cabin: "/stays/cabin.jpg",
  courtyard: "/stays/courtyard.jpg",
  seaside: "/stays/seaside.jpg",
};

const names = [
  ["silk-road-grand", "Silk Road Grand", "Samarkand", "Uzbekistan", "Luxury", "A calm, contemporary sanctuary beside Samarkand's storied old town.", photos.samarkand, 238, 4.9, ["Pool", "Spa", "Restaurant", "Airport transfer"]],
  ["tashkent-house", "The Tashkent House", "Tashkent", "Uzbekistan", "Boutique", "Quiet design, generous hospitality, and a garden in the heart of the city.", photos.tashkent, 164, 4.8, ["Garden", "Breakfast", "Wi-Fi", "Restaurant"]],
  ["bukhara-courtyard", "Bukhara Courtyard", "Bukhara", "Uzbekistan", "Boutique", "An intimate heritage stay wrapped around a sunlit courtyard.", photos.bukhara, 112, 4.9, ["Courtyard", "Breakfast", "Wi-Fi", "Historic district"]],
  ["blue-horizon", "Blue Horizon Retreat", "Chorvoq", "Uzbekistan", "Resort", "A lakeside escape with mountain air, private terraces, and long golden evenings.", photos.beach, 186, 4.7, ["Pool", "Lake access", "Spa", "Family rooms"]],
  ["mountain-pines", "Mountain Pines Lodge", "Chimgan", "Uzbekistan", "Mountain", "Warm wood, crisp mornings, and a front-row seat to the Chimgan peaks.", photos.mountain, 98, 4.8, ["Mountain views", "Fireplace", "Hiking", "Breakfast"]],
  ["desert-camp", "Kyzylkum Starlight Camp", "Nurata", "Uzbekistan", "Unique", "Sleep beneath vast desert skies in a considered, locally hosted camp.", photos.camp, 86, 4.7, ["Stargazing", "Local dining", "Guided walks", "Transfers"]],
  ["garden-villa", "Garden Gate Villa", "Tashkent", "Uzbekistan", "Family", "A private family villa with room to slow down and feel at home.", photos.villa, 205, 4.6, ["Kitchen", "Garden", "Family rooms", "Parking"]],
  ["old-town-apartment", "Old Town Residence", "Samarkand", "Uzbekistan", "Apartment", "A light-filled apartment made for lingering mornings and longer stays.", photos.apartment, 74, 4.5, ["Kitchen", "Laundry", "Wi-Fi", "Self check-in"]],
  ["silk-street-inn", "Silk Street Inn", "Bukhara", "Uzbekistan", "Budget", "A welcoming, great-value base close to Bukhara's covered bazaars.", photos.boutique, 48, 4.4, ["Breakfast", "Wi-Fi", "24-hour reception", "Airport transfer"]],
  ["khiva-minaret-house", "Minaret House", "Khiva", "Uzbekistan", "Boutique", "A tranquil heritage-inspired retreat just beyond the old city walls.", photos.courtyard, 91, 4.8, ["Courtyard", "Breakfast", "Wi-Fi", "Historic district"]],
  ["shahrisabz-garden", "Garden of Timur", "Shahrisabz", "Uzbekistan", "Family", "A relaxed garden stay close to the monumental historic centre.", photos.architecture, 68, 4.5, ["Garden", "Family rooms", "Breakfast", "Parking"]],
  ["fergana-silk-residence", "Silk Valley Residence", "Fergana", "Uzbekistan", "Business", "A polished city base with attentive service and spacious rooms.", photos.interior, 82, 4.5, ["Business centre", "Restaurant", "Wi-Fi", "Parking"]],
  ["andijan-orchard-inn", "Orchard Lane Inn", "Andijan", "Uzbekistan", "Budget", "A warm, practical stay with a leafy courtyard and local breakfast.", photos.boutique, 42, 4.3, ["Breakfast", "Garden", "Wi-Fi", "Parking"]],
  ["namangan-silk-boutique", "Silk & Cedar Boutique", "Namangan", "Uzbekistan", "Boutique", "Contemporary comfort shaped by the valley's craft traditions.", photos.room, 76, 4.6, ["Restaurant", "Wi-Fi", "Garden", "Airport transfer"]],
  ["nukus-desert-atelier", "Desert Atelier", "Nukus", "Uzbekistan", "Unique", "A characterful small hotel and thoughtful base for regional discovery.", photos.camp, 59, 4.5, ["Local dining", "Wi-Fi", "Tours", "Parking"]],
  ["zaamin-pine-retreat", "Pine & Peak Retreat", "Zaamin", "Uzbekistan", "Mountain", "Fresh mountain air, generous balconies, and a quiet woodland setting.", photos.cabin, 128, 4.8, ["Mountain views", "Hiking", "Fireplace", "Family rooms"]],
  ["istanbul-bosphorus", "Bosphorus House", "Istanbul", "Türkiye", "Luxury", "An elegant waterfront escape with sweeping views across the strait.", photos.city, 246, 4.8, ["Spa", "Restaurant", "Waterfront", "Airport transfer"]],
  ["antalya-cove-resort", "Cove & Citrus Resort", "Antalya", "Türkiye", "Resort", "A sunlit Mediterranean resort with a private stretch of coast.", photos.seaside, 212, 4.7, ["Beach access", "Pool", "Spa", "Family rooms"]],
  ["dubai-desert-palms", "Desert Palms Dubai", "Dubai", "United Arab Emirates", "Luxury", "A serene urban hideaway with considered dining and skyline views.", photos.pool, 318, 4.9, ["Pool", "Spa", "Restaurant", "Gym"]],
  ["abu-dhabi-mangrove", "Mangrove House", "Abu Dhabi", "United Arab Emirates", "Eco-lodge", "A contemporary retreat beside protected mangroves and quiet waterways.", photos.nature, 187, 4.7, ["Nature walks", "Pool", "Restaurant", "Kayaking"]],
  ["doha-pearl-residence", "Pearl Courtyard Hotel", "Doha", "Qatar", "Business", "A calm, service-minded city stay with rooms made for longer visits.", photos.interior, 173, 4.6, ["Business centre", "Pool", "Restaurant", "Airport transfer"]],
  ["tbilisi-old-quarter", "Old Quarter House", "Tbilisi", "Georgia", "Boutique", "A restored townhouse with a welcoming terrace above the old streets.", photos.courtyard, 109, 4.8, ["Terrace", "Breakfast", "Historic district", "Wi-Fi"]],
  ["batumi-black-sea", "Black Sea Garden Hotel", "Batumi", "Georgia", "Resort", "A relaxed coastal address where garden paths meet sea air.", photos.coast, 136, 4.6, ["Beach access", "Pool", "Garden", "Restaurant"]],
  ["baku-caspian-view", "Caspian View Residence", "Baku", "Azerbaijan", "Luxury", "A refined address pairing Caspian views with warm local hospitality.", photos.luxury, 202, 4.8, ["Sea views", "Spa", "Restaurant", "Gym"]],
  ["almaty-alpine-house", "Alpine House Almaty", "Almaty", "Kazakhstan", "Mountain", "A stylish city lodge with the mountains never far from view.", photos.mountain, 142, 4.7, ["Mountain views", "Sauna", "Restaurant", "Hiking"]],
  ["bangkok-lantern-stay", "Lantern House Bangkok", "Bangkok", "Thailand", "Boutique", "A leafy retreat with a quiet pool tucked into the city energy.", photos.pool, 96, 4.6, ["Pool", "Garden", "Restaurant", "Transit nearby"]],
  ["bali-tide-villa", "Tide & Palm Villa", "Bali", "Indonesia", "Villa", "A private tropical villa with an open-air lounge and plunge pool.", photos.villa, 224, 4.9, ["Private pool", "Garden", "Kitchen", "Beach nearby"]],
  ["kuala-lumpur-canopy", "Canopy City Suites", "Kuala Lumpur", "Malaysia", "Apartment", "Light-filled serviced suites close to the city's dining and design.", photos.apartment, 88, 4.5, ["Kitchen", "Pool", "Gym", "Wi-Fi"]],
  ["singapore-garden-suite", "Garden City House", "Singapore", "Singapore", "Business", "An efficient and graceful city stay with a rare garden outlook.", photos.nature, 231, 4.7, ["Garden", "Business centre", "Restaurant", "Transit nearby"]],
  ["paris-left-bank", "Left Bank Atelier", "Paris", "France", "Boutique", "A small design-led address for lingering mornings on the Left Bank.", photos.interior, 276, 4.7, ["Breakfast", "Historic district", "Wi-Fi", "Concierge"]],
  ["rome-courtyard-stay", "Via Verde Courtyard", "Rome", "Italy", "Boutique", "A quiet courtyard hotel within easy reach of Rome's classic sights.", photos.courtyard, 198, 4.7, ["Courtyard", "Breakfast", "Historic district", "Wi-Fi"]],
  ["barcelona-sun-house", "Sun House Barcelona", "Barcelona", "Spain", "Family", "A bright family-friendly base between city culture and the shoreline.", photos.coast, 184, 4.6, ["Family rooms", "Beach nearby", "Kitchen", "Wi-Fi"]],
  ["london-bloom-house", "Bloom House London", "London", "United Kingdom", "Boutique", "A quietly elegant townhouse stay with a neighbourhood feel.", photos.room, 255, 4.7, ["Breakfast", "Garden", "Concierge", "Transit nearby"]],
  ["vienna-muse-residence", "Muse Residence", "Vienna", "Austria", "Luxury", "A graceful city residence inspired by Vienna's musical heritage.", photos.architecture, 221, 4.8, ["Spa", "Restaurant", "Historic district", "Concierge"]],
  ["prague-amber-court", "Amber Court Prague", "Prague", "Czechia", "Boutique", "A warm, intimate base in a restored old-town building.", photos.courtyard, 132, 4.8, ["Courtyard", "Breakfast", "Historic district", "Wi-Fi"]],
  ["zurich-lake-lodge", "Lake & Linden Lodge", "Zurich", "Switzerland", "Luxury", "An airy lakeside retreat framed by Alpine light and quiet gardens.", photos.seaside, 342, 4.8, ["Lake access", "Spa", "Restaurant", "Mountain views"]],
  ["amsterdam-canal-house", "Canal House No. 8", "Amsterdam", "Netherlands", "Boutique", "A characterful canal-side stay with thoughtful rooms and local touches.", photos.city, 209, 4.7, ["Canal views", "Breakfast", "Historic district", "Bicycle rental"]],
  ["tokyo-quiet-lantern", "Quiet Lantern Tokyo", "Tokyo", "Japan", "Business", "A considered urban hideaway with clever spaces and calm evenings.", photos.interior, 174, 4.7, ["Restaurant", "Transit nearby", "Wi-Fi", "Laundry"]],
  ["seoul-hanok-garden", "Hanok Garden Stay", "Seoul", "South Korea", "Unique", "A modern guesthouse with a peaceful courtyard and heritage details.", photos.courtyard, 121, 4.8, ["Courtyard", "Breakfast", "Historic district", "Wi-Fi"]],
  ["kyoto-maple-inn", "Maple & Moss Inn", "Kyoto", "Japan", "Boutique", "A serene, garden-facing inn designed around the changing seasons.", photos.nature, 196, 4.9, ["Garden", "Tea room", "Breakfast", "Historic district"]],
  ["new-york-studio-house", "Studio House Manhattan", "New York", "United States", "Apartment", "An efficient apartment stay made for exploring the city at your pace.", photos.apartment, 298, 4.5, ["Kitchen", "Laundry", "Gym", "Transit nearby"]],
  ["los-angeles-pacific", "Pacific Light Hotel", "Los Angeles", "United States", "Resort", "A relaxed California base with sunlit rooms and an inviting pool.", photos.resort, 242, 4.6, ["Pool", "Parking", "Gym", "Beach nearby"]],
  ["miami-south-shore", "South Shore Palm Resort", "Miami", "United States", "Beach", "A colourful coastal escape steps from warm sand and ocean breezes.", photos.seaside, 214, 4.6, ["Beach access", "Pool", "Restaurant", "Family rooms"]],
  ["toronto-maple-suites", "Maple Leaf Suites", "Toronto", "Canada", "Apartment", "Generous serviced apartments for city weekends and longer stays.", photos.room, 168, 4.5, ["Kitchen", "Laundry", "Gym", "Transit nearby"]],
  ["cape-town-table-view", "Table View House", "Cape Town", "South Africa", "Villa", "A hillside home with generous terraces and mountain-to-sea views.", photos.villa, 187, 4.8, ["Mountain views", "Pool", "Garden", "Kitchen"]],
  ["cairo-nile-courtyard", "Nile Courtyard Hotel", "Cairo", "Egypt", "Boutique", "A welcoming urban retreat with calm interiors and a rooftop terrace.", photos.courtyard, 114, 4.5, ["Rooftop terrace", "Restaurant", "Historic district", "Airport transfer"]],
  ["marrakech-riad-rose", "Riad Rose & Cedar", "Marrakech", "Morocco", "Romantic", "A peaceful riad with a shaded patio and intimate candlelit dining.", photos.courtyard, 153, 4.9, ["Courtyard", "Spa", "Local dining", "Rooftop terrace"]],
  ["maldives-coral-bungalow", "Coral Tide Bungalows", "North Malé Atoll", "Maldives", "Beach", "Overwater-style island bungalows with lagoon views and slow mornings.", photos.coast, 489, 4.9, ["Beach access", "Snorkelling", "Restaurant", "Spa"]],
  ["santorini-blue-terrace", "Blue Terrace Retreat", "Santorini", "Greece", "Romantic", "A whitewashed retreat with sunset terraces over the Aegean.", photos.seaside, 365, 4.9, ["Sea views", "Pool", "Breakfast", "Romantic"]],
  ["lisbon-hill-house", "Seven Hills House", "Lisbon", "Portugal", "Budget", "A friendly, great-value base for exploring Lisbon's hills and cafés.", photos.boutique, 79, 4.5, ["Breakfast", "Terrace", "Wi-Fi", "Transit nearby"]],
  ["queenstown-lake-cabin", "Alpine Lake Cabins", "Queenstown", "New Zealand", "Eco-lodge", "A low-key lakeside cabin stay with outdoor adventures close by.", photos.cabin, 198, 4.8, ["Lake access", "Hiking", "Fireplace", "Kitchen"]],
  ["patagonia-wild-lodge", "Southern Sky Lodge", "El Calafate", "Argentina", "Eco-lodge", "A cosy, nature-minded base for remarkable Patagonian landscapes.", photos.camp, 176, 4.7, ["Nature walks", "Local dining", "Fireplace", "Transfers"]],
  ["amman-olive-courtyard", "Olive Courtyard Amman", "Amman", "Jordan", "Family", "A relaxed, welcoming home base with a quiet outdoor courtyard.", photos.courtyard, 102, 4.6, ["Courtyard", "Family rooms", "Breakfast", "Parking"]],
  ["muscat-sea-cliff", "Sea Cliff Retreat", "Muscat", "Oman", "Resort", "A peaceful coastal hideaway with mountain silhouettes at dusk.", photos.resort, 229, 4.8, ["Beach access", "Pool", "Spa", "Restaurant"]],
  ["delhi-courtyard-nook", "Courtyard Nook Delhi", "New Delhi", "India", "Budget", "A friendly garden hotel offering comfort and thoughtful local hosting.", photos.boutique, 67, 4.4, ["Garden", "Breakfast", "Wi-Fi", "Airport transfer"]],
  ["istanbul-galata-house", "Galata House", "Istanbul", "Türkiye", "Apartment", "A characterful apartment near galleries, cafés, and the waterfront.", photos.apartment, 129, 4.6, ["Kitchen", "Laundry", "Historic district", "Wi-Fi"]],
] as const;

const galleryPhotos = Object.values(photos);
export const hotels: Hotel[] = names.map(([slug, name, city, country, category, description, image, price, rating, amenities], index) => ({
  id: `qs-${slug}`,
  slug, name, city, country, category, description, image,
  images: [image, galleryPhotos[(index + 5) % galleryPhotos.length], galleryPhotos[(index + 9) % galleryPhotos.length]],
  amenities: [...amenities],
  rating, reviews: 84 + index * 37, price,
  currency: "USD",
  stars: category === "Luxury" ? 5 : category === "Boutique" || category === "Resort" ? 4 : 3,
  capacity: category === "Family" || category === "Villa" ? 5 : 3,
  checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation up to 48 hours before arrival. Sample policy.",
  featured: index < 9,
  availability: { demoOnly: true, sampleRooms: 2 + index % 4 },
  rooms: [
    { id: "comfort", name: "Comfort Room", description: "A thoughtfully appointed room for an easy stay.", price, guests: 2, bed: "1 queen bed" },
    { id: "suite", name: "Signature Suite", description: "Extra room to unwind, with a private sitting area.", price: Math.round(price * 1.7), guests: 3, bed: "1 king bed" },
  ],
}));

export const getHotel = (slug: string) => hotels.find((hotel) => hotel.slug === slug);

const ids = new Set(hotels.map(({ id }) => id));
const slugs = new Set(hotels.map(({ slug }) => slug));
if (hotels.length < 50 || ids.size !== hotels.length || slugs.size !== hotels.length ||
    hotels.some((hotel) => !hotel.images.length || hotel.rooms.length === 0 || hotel.price <= 0 || hotel.availability.demoOnly !== true)) {
  throw new Error("Seeded demo catalog must contain at least 50 complete hotels with unique IDs and slugs.");
}
