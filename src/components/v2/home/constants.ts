export interface HeroSlide {
  image: string;
  tag: string;
  title: string;
  highlight: string;
}

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    image: "/images/banner.png",
    tag: "Welcome to TheYard",
    title: "Memorable, exciting, joyful, and historic",
    highlight: "moments",
  },
  {
    image: "/images/banner.png",
    tag: "Experience Luxury",
    title: "Unforgettable weddings, corporate events, and",
    highlight: "celebrations",
  },
  {
    image: "/images/banner.png",
    tag: "Our Spaces",
    title: "Elegant venues designed for your perfect",
    highlight: "occasion",
  },
  {
    image: "/images/banner.png",
    tag: "Book Now",
    title: "Create memories that last a",
    highlight: "lifetime",
  },
];

export interface PerkItem {
  image: string;
  title: string;
  subtitle: string;
}

export const PERKS: readonly PerkItem[] = [
  {
    image: "basket.png",
    title: "Beautiful Setups",
    subtitle: "Thoughtfully styled picnics for any occasion",
  },
  {
    image: "decor.png",
    title: "Decor & Styling",
    subtitle: "Balloons, florals & custom event styling.",
  },
  {
    image: "private.png",
    title: "Private Spaces",
    subtitle: "Gazeebos & private dinning for intimate moments.",
  },
  {
    image: "private.png",
    title: "Picture Perfect",
    subtitle: "Instagramable spots in aserene environment.",
  },
];

export const CAROUSEL_SWIPER_PROPS = {
  freeMode: true,
  grabCursor: true,
  simulateTouch: true,
  touchRatio: 1,
  touchAngle: 45,
  threshold: 5,
  resistance: true,
  resistanceRatio: 0.85,
} as const;
