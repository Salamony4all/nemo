export interface TourOffer {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  fullDetails: string;
  price: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  groupSize: string;
  languages: string[];
  imageUrl: string;
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
  operator: {
    name: string;
    arabicName: string;
    badge: string;
    bio: string;
    address: string;
    phones: string[];
  };
}

export interface MediaAsset {
  id: string;
  type: "photo" | "reel";
  title: string;
  sourceUrl: string;
  fallbackUrl: string; // CORS safe local path or direct downloadable asset
  caption: string;
  duration?: string;
  likesCount: number;
  sharesCount: number;
  publishDate: string;
  facebookUrl?: string;
  embedIframeUrl?: string;
}

export interface BookingDetails {
  tourId: string;
  selectedDate: string;
  adultsCount: number;
  childrenCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
