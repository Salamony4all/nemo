import { TourOffer, MediaAsset } from "./types";

export const PRESEEDED_OFFERS: TourOffer[] = [
  {
    id: "marsa-alam-dolphins",
    title: "Marsa Alam Dolphin Snorkeling Safari",
    arabicTitle: "يلا نصيف في مرسي علم - ونلعب مع الدولفين",
    description: "Get ready for some Red Sea magic! We're taking you to snorkel with dolphins, check out the coolest coral reefs, and chill out with premium hospitality on our awesome luxury yachts.",
    fullDetails: "Experience the ultimate marine adventure in Marsa Alam. Located on the beautiful Red Sea coastline, Marsa Alam offers one of the richest coral reef complexes in the world. Our daily tours pick you up directly from your hotel in comfortable air-conditioned coaches and bring you to the marina where our premium yachts await. Throughout the day, you will stop at different dolphin-frequent bays, swim with wild dolphins, snorkel amongst crystal status coral formations, and be treated to a lush freshly prepared buffet lunch on board. Expert marine guides are present to guarantee safety and provide comprehensive instruction.",
    price: 38,
    rating: 4.9,
    reviewsCount: 2150,
    duration: "3 Days",
    groupSize: "Max 15 guests",
    languages: ["Arabic", "English", "Italian", "German"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Pivoft42S7U5hc24l7PiZVTL5E2DXiDptS3Lz-IDgQu1wwaL0kJsoRzhskLyV_uXfWn1QX60jWwsSKAaO76Hw0BDPgS1_YK6r6a2OwKSPx3DiSQOyRuFXLEzbuUOfGQYMDMppWIXLMNcn54ufd707hHajV_8k-wYaIEptni8hfNfbpXxTVRrZd-56NqZpmczgxN9V3oG4hEMVgA73URwwDovizUJttfBNFjjvNkJrKhDHE6Ik7DQhzdjzCG7p6HSGLYynSZBX_Y",
    highlights: [
      {
        icon: "scuba_diving",
        title: "Snorkeling Equipment Included",
        description: "Premium masks, dry-top snorkels, adjustable fins, and certified life jackets provided.",
      },
      {
        icon: "restaurant",
        title: "Buffet Lunch on Board",
        description: "Freshly prepared local Egyptian and international cuisine, seasonal fruits, and soft drinks.",
      },
      {
        icon: "support_agent",
        title: "Professional Safe Guides",
        description: "Expert scuba-certified guide crew showing you hidden tunnels and reef clusters safely.",
      },
      {
        icon: "airport_shuttle",
        title: "Hotel Pickup & Drop-off",
        description: "Convenient luxury minivan transport included from Marsa Alam and Port Ghalib hotels.",
      }
    ],
    operator: {
      name: "Nemo Tours",
      arabicName: "نيمو تورز",
      badge: "Verified Operator",
      bio: "Premium Egyptian Expeditions. Your gateway to the Red Sea's hidden gems.",
      address: "78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.",
      phones: ["01100086772", "01100086796", "01032212504"]
    }
  },
  {
    id: "luxury-yacht-sunset",
    title: "VIP Sunset Cruise & Deep Sea Swimming",
    arabicTitle: "رحلة اليخت الفاخرة وقت الغروب",
    description: "Sail into the golden Marsa Alam horizon on our state-of-the-art catamaran. Enjoy fine dining, refreshing sea breeze, and swimming in deep blue lagoons.",
    fullDetails: "Indulge in a magnificent late afternoon cruise tailored for those who appreciate comfort, premium dining, and majestic seaside scenery. Starting at 2:00 PM, we cruise down the coastline, stopping in secluded bays where you can swim in crystal-clear deep waters or relax on the sunbeds of the yacht deck. As the golden hour approaches, we anchor to catch the breathtaking Sunset with deep-ocean visibility. A premium seafood and grilled buffet is prepared on board by our private chef, followed by authentic tea and desserts.",
    price: 25,
    rating: 4.8,
    reviewsCount: 1240,
    duration: "2 Days",
    groupSize: "Max 12 guests",
    languages: ["Arabic", "English", "French"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1XUcQAX2bKD2WkgTRfXmmDiF_3bTnSyOlZBY0xq5SHNUlrBDIbL6XkQB9zw2sAAYBnr8zCxfdf64w0dRB05rjuZtK1knZNCHnQfKWyW-CPkAqLuNTs2T4HvEvyKYXYpDxpABAkQtVMweUiERSLHxn6OVV701KGf2Xx0zHx3ohMXJ4gg-s3Av-XuESPSeUjMZ1agba9lH88h0KKS_3TZBvL04xt3zTIYE8QweKUWMsy_3Ohei6hKm_KakqdglfcS2Ph80lpJOfCBA",
    highlights: [
      {
        icon: "wb_sunny",
        title: "Golden Hour Photography",
        description: "Candid seaside portraits taken by professional onboard visual hosts.",
      },
      {
        icon: "dinner_dining",
        title: "Seafood BBQ Buffet",
        description: "Fresh red sea fish, marinated jumbo prawns, grilled chicken, and exotic oriental desserts.",
      },
      {
        icon: "waves",
        title: "Deep Sea Diving Stops",
        description: "Access to deep sea swim spots with high buoyancy safety vests and floating lounge rafts.",
      }
    ],
    operator: {
      name: "Nemo Tours",
      arabicName: "نيمو تورز",
      badge: "Verified Operator",
      bio: "Premium Egyptian Expeditions. Your gateway to the Red Sea's hidden gems.",
      address: "78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.",
      phones: ["01100086772", "01100086796"]
    }
  },
  {
    id: "coral-reef-adventure",
    title: "Pristine Coral Bays Snorkeling Cruise",
    arabicTitle: "رحلة البحث عن الشعب المرجانية النادرة",
    description: "Explore the untouched underwater forests of Marsa Alam. Encounter colorful tropical fish, wild sea turtles, and rare dugongs under expert navigation.",
    fullDetails: "This designated eco-snorkeling excursion focuses on discovering Marsa Alam's most biodiverse bays. Specially guided by experienced diving naturalists, we'll navigate the catamaran through shallow coral gardens and turquoise channels. You will learn about coral preservation and spot rare sea animals including green sea turtles, clownfish, manta rays, and if lucky, local dugongs (sea cows). Includes a delicious traditional lunch, chilled fresh juices, and round-trip transport.",
    price: 19,
    rating: 4.95,
    reviewsCount: 3100,
    duration: "2 Days",
    groupSize: "Max 18 guests",
    languages: ["Arabic", "English", "Italian", "Spanish"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANmkIGdcRwtMGKDW-v45-hhzc950sv5jhX3kU7PyGMjYA12yigbHEEVAoYIdoC7tCjS3ZYgndvS-ROJDyM9NpK0Ob7MN_eoHFGJ6rQgVQ-su4lz6HBJuYbSRrdum9A1rXIOELyddVl_DsQFv5fe_tMoKdVE6pE6N7tF-BNNAVR9-4PWZC8bEaLd_iqsxqI7lbOG4c6uyzv5HydBp8x3lo7PiZNxX2JyAdpKoiBXWDX5B3L6_xClShvGNbbUgp9Cd99R_bJfiIvIfI",
    highlights: [
      {
        icon: "eco",
        title: "Eco-Diving Naturalist",
        description: "Fascinating educational insights into Marsa Alam's delicate marine ecosystem.",
      },
      {
        icon: "restaurant",
        title: "Traditional Egyptian Lunch",
        description: "Koshary, fresh tahini salads, grilled kofta, and freshly squeezed mango juices.",
      },
      {
        icon: "camera_outdoor",
        title: "GoPro Rental Included",
        description: "Receive free raw underwater video footages filmed with our on-board high-definition action cameras.",
      }
    ],
    operator: {
      name: "Nemo Tours",
      arabicName: "نيمو تورز",
      badge: "Verified Operator",
      bio: "Premium Egyptian Expeditions. Your gateway to the Red Sea's hidden gems.",
      address: "78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.",
      phones: ["01100086772", "01100086796"]
    }
  },
  {
    id: "abu-dabbab-shore",
    title: "Abu Dabbab Eco-Camp & Coastal Turtle Snorkeling",
    arabicTitle: "مخيم شاطئ أبو دباب البيئي لسباحة السلاحف",
    description: "An incredibly affordable, high-value eco-snorkeling tour to the world-famous Abu Dabbab beach. Snorkel with giant green sea turtles and dugongs.",
    fullDetails: "Experience the majestic beauty of Marsa Alam without the premium yacht fees. Our Abu Dabbab Coastal Eco-Tour takes you directly to the protected bay of Abu Dabbab, legendary for its colossal resident green sea turtles and migratory dugongs. You will enjoy a guided beach-entry swim through gorgeous coral corridors, followed by a local Bedouin tea and lunch experience right on our traditional beach camp. Includes beach loungers, dual-diving certified safety coordinators, and full snorkel gear.",
    price: 15,
    rating: 4.85,
    reviewsCount: 880,
    duration: "2 Days",
    groupSize: "Max 20 guests",
    languages: ["Arabic", "English", "Italian"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQeUS2XMmtzZmsj54AbzlB_OM_9H5yZ3iLjparYzt59UtJNrcr6cJnBqjCTY56qkakiPSwtXXVqvyT1hahWvJnA_5chtKCDDExvWOxS9AMsXmlsu6bEd7VZfgq3Gaxd5ewPOfiI1qYYHmj3zTHpidA4qXUYavSFEb2coGcoYkZHrr-i47Cp_tYLK0apMNO3mnZGXOM1f0AWocnkg6Ap9W51sLRwVWWTWW3NLCWVwRgeJ1nM59CcPl8sjcffpQpQXqb3vjXFX3_bMQ",
    highlights: [
      {
        icon: "beach_access",
        title: "Traditional Bedouin Camp",
        description: "Relaxed shore seating, premium Bedouin herbal tea, and delicious local grilled lunch.",
      },
      {
        icon: "scuba_diving",
        title: "Snorkeling Shore Equipment",
        description: "Professional fit goggles, high-glide fins, and thermal rash guards included.",
      },
      {
        icon: "support_agent",
        title: "Certified Turtle Eco-Guides",
        description: "Expert marine conservation guides who know exact turtle feeding locations.",
      }
    ],
    operator: {
      name: "Nemo Tours",
      arabicName: "نيمو تورز",
      badge: "Verified Operator",
      bio: "Premium Egyptian Expeditions. Your gateway to the Red Sea's hidden gems.",
      address: "78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.",
      phones: ["01100086772", "01100086796"]
    }
  },
  {
    id: "nemo-custom-tailored",
    title: "Nemo Tours Custom Private Family Charter",
    arabicTitle: "تنظيم رحلات خاصة وعائلية متكاملة",
    description: "Design your perfect customized expedition. Private luxury yachts, bespoke meal menus, isolated diving spots, and specialized crew support.",
    fullDetails: "Perfect for family reunions, surprise honeymoons, or corporate expeditions. When renting a private Nemo charter, you command a dedicated luxury yacht, a certified captain, and a personal chef. Plan your own timetable—whether you prefer early morning dolphin seeking or late evening deep sea grilling. Customize your menu to accommodate all dietary patterns and request special scuba equipment or water sports gear.",
    price: 190,
    rating: 5.0,
    reviewsCount: 480,
    duration: "3-5 Days",
    groupSize: "Private Group Only",
    languages: ["Arabic", "English", "Italian", "Russian", "German"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_SWCD_TumVBoirCfcgRyZkuxnomNdIbuzoVZTAVm1niZ2RpqNza2L1AUnswE6l3WNpP2UDpzRkM9fFQhCXXVqj3liPCWpJEaupYk_iRroNDwu9JIk5jCqGCqFadto93JAGbIl1_7yKPwAgXYUSj6EdZq_53nMwywPG5bRxYESlBXVu2dB5fq1_IffGDnkyEpj2efMdorWKBzjqMbMdm3aNwVz4gN_8zZ3Js4FJ4uAugFRLyce1kzM_2bo9ZCQ-KKU4372NcPQrLI",
    highlights: [
      {
        icon: "anchor",
        title: "100% Private Yacht",
        description: "The entire premium deck, lounge rooms, and dive board reserved exclusively for you.",
      },
      {
        icon: "room_service",
        title: "Tailored Food Menus",
        description: "Choose customized menus prepared directly in front of you—seafood, keto, vegan, or traditional.",
      },
      {
        icon: "tour",
        title: "Customized Itinerary",
        description: "Decide stops, water sports, diving lengths, and optional land tours based on your exact intent.",
      }
    ],
    operator: {
      name: "Nemo Tours",
      arabicName: "نيمو تورز",
      badge: "Verified Operator",
      bio: "Premium Egyptian Expeditions. Your gateway to the Red Sea's hidden gems.",
      address: "78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.",
      phones: ["01100086772", "01100086796"]
    }
  }
];

export const PRESEEDED_MEDIA: MediaAsset[] = [
  {
    id: "reel-sokhna",
    type: "reel",
    title: "Nemo Tours Economic Sokhna Resort Getaway",
    sourceUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    fallbackUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    caption: "طلبتوا كتير فندق اقتصادي في العين السخنه، يكون في اكوا بارك وحمامات سباحة وكمان ليه اكسس علي شاطي رملي، مع نيمو تورز انت محقق المعادلة الصعبة! 🏖️🌊 #NemoTours #AinSokhna",
    duration: "0:45",
    likesCount: 2840,
    sharesCount: 1250,
    publishDate: "2026-06-17",
    facebookUrl: "https://www.facebook.com/reel/27972215212386715/",
    embedIframeUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F27972215212386715%2F&show_text=false&width=267&t=0"
  },
  {
    id: "reel-yacht",
    type: "reel",
    title: "Luxury Catamaran Morning Launch",
    sourceUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    caption: "Waking up on the premium deck is unmatched! Join our VIP Daily Cruise for high-end hospitality, snorkeling, and amazing BBQ. 🌊🥂 #NemoTours",
    duration: "0:18",
    likesCount: 980,
    sharesCount: 125,
    publishDate: "2026-06-15",
    facebookUrl: "https://www.facebook.com/tours.nemo/reels/832948291039824/",
    embedIframeUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Ftours.nemo%2Freels%2F832948291039824%2F&show_text=false&width=267&t=0"
  },
  {
    id: "reel-reef",
    type: "reel",
    title: "Dolphins and Coral Reef Tracking",
    sourceUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    caption: "Spotted! Swimming alongside dolphins in amazing Red Sea bays with Nemo Tours! Book now and make incredible memories. 🐬🛥️ #RedSea #TravelEgypt",
    duration: "0:30",
    likesCount: 2210,
    sharesCount: 540,
    publishDate: "2026-06-16",
    facebookUrl: "https://www.facebook.com/tours.nemo/videos/984712039481729/",
    embedIframeUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Ftours.nemo%2Fvideos%2F984712039481729%2F&show_text=false&width=267&t=0"
  },
  {
    id: "photo-island",
    type: "photo",
    title: "Marsa Alam Coral Reefs Overhead View",
    sourceUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQeUS2XMmtzZmsj54AbzlB_OM_9H5yZ3iLjparYzt59UtJNrcr6cJnBqjCTY56qkakiPSwtXXVqvyT1hahWvJnA_5chtKCDDExvWOxS9AMsXmlsu6bEd7VZfgq3Gaxd5ewPOfiI1qYYHmj3zTHpidA4qXUYavSFEb2coGcoYkZHrr-i47Cp_tYLK0apMNO3mnZGXOM1f0AWocnkg6Ap9W51sLRwVWWTWW3NLCWVwRgeJ1nM59CcPl8sjcffpQpQXqb3vjXFX3_bMQ",
    fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQeUS2XMmtzZmsj54AbzlB_OM_9H5yZ3iLjparYzt59UtJNrcr6cJnBqjCTY56qkakiPSwtXXVqvyT1hahWvJnA_5chtKCDDExvWOxS9AMsXmlsu6bEd7VZfgq3Gaxd5ewPOfiI1qYYHmj3zTHpidA4qXUYavSFEb2coGcoYkZHrr-i47Cp_tYLK0apMNO3mnZGXOM1f0AWocnkg6Ap9W51sLRwVWWTWW3NLCWVwRgeJ1nM59CcPl8sjcffpQpQXqb3vjXFX3_bMQ",
    caption: "The crystal-clear water of our snorkeling spots has up to 30 meters of visibility. Unbelievable natural ecosystem at Marsa Alam. 🐠 Coral Reef Heaven.",
    likesCount: 3120,
    sharesCount: 710,
    publishDate: "2026-06-10",
    facebookUrl: "https://www.facebook.com/tours.nemo/photos/a.478235450981123/478235450981122/",
    embedIframeUrl: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftours.nemo%2Fphotos%2Fa.478235450981123%2F478235450981122%2F&show_text=true&width=350"
  },
  {
    id: "photo-group",
    type: "photo",
    title: "Nemo Team Group Excursion",
    sourceUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANmkIGdcRwtMGKDW-v45-hhzc950sv5jhX3kU7PyGMjYA12yigbHEEVAoYIdoC7tCjS3ZYgndvS-ROJDyM9NpK0Ob7MN_eoHFGJ6rQgVQ-su4lz6HBJuYbSRrdum9A1rXIOELyddVl_DsQFv5fe_tMoKdVE6pE6N7tF-BNNAVR9-4PWZC8bEaLd_iqsxqI7lbOG4c6uyzv5HydBp8x3lo7PiZNxX2JyAdpKoiBXWDX5B3L6_xClShvGNbbUgp9Cd99R_bJfiIvIfI",
    fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANmkIGdcRwtMGKDW-v45-hhzc950sv5jhX3kU7PyGMjYA12yigbHEEVAoYIdoC7tCjS3ZYgndvS-ROJDyM9NpK0Ob7MN_eoHFGJ6rQgVQ-su4lz6HBJuYbSRrdum9A1rXIOELyddVl_DsQFv5fe_tMoKdVE6pE6N7tF-BNNAVR9-4PWZC8bEaLd_iqsxqI7lbOG4c6uyzv5HydBp8x3lo7PiZNxX2JyAdpKoiBXWDX5B3L6_xClShvGNbbUgp9Cd99R_bJfiIvIfI",
    caption: "Happy faces in the turquoise lagoons of Marsa Alam playing with dolphins! High-quality life vests and pro guides keep everyone safe. Join our next cohort!",
    likesCount: 1850,
    sharesCount: 290,
    publishDate: "2026-06-14",
    facebookUrl: "https://www.facebook.com/tours.nemo/photos/a.478235450981123/478235450981124/",
    embedIframeUrl: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftours.nemo%2Fphotos%2Fa.478235450981123%2F478235450981124%2F&show_text=true&width=350"
  },
  {
    id: "reel-satayah",
    type: "reel",
    title: "Satayah Dolphin Reef Swim (Amazing Raw Reel)",
    sourceUrl: "https://assets.mixkit.co/videos/preview/mixkit-school-of-fish-swimming-overhead-in-deep-ocean-42416-large.mp4",
    fallbackUrl: "https://assets.mixkit.co/videos/preview/mixkit-school-of-fish-swimming-overhead-in-deep-ocean-42416-large.mp4",
    caption: "Full school of colorful marine life and spinner dolphins in the Satayah Protected Reef! Live capture from the catamaran. 🐠🐬 Visit Marsa Alam! #Satayah #EgyptTours",
    duration: "0:15",
    likesCount: 3105,
    sharesCount: 680,
    publishDate: "2026-06-16",
    facebookUrl: "https://www.facebook.com/tours.nemo/videos/348291039824812/",
    embedIframeUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Ftours.nemo%2Fvideos%2F348291039824812%2F&show_text=false&width=267&t=0"
  }
];
