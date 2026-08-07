export const CONFIG = {
  brandName: "Asolea",
  whatsappNumber: (import.meta.env.VITE_ASOLEA_WHATSAPP || "").replace(/\D/g, ""),
  email: import.meta.env.VITE_ASOLEA_EMAIL || "",
  instagramUrl: import.meta.env.VITE_ASOLEA_INSTAGRAM || "https://www.instagram.com/",
};

export const CURRENCY = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const HERO_NOTES = [
  "Compra asistida por WhatsApp",
  "Catálogo visual con tallas, colores y disponibilidad",
  "Pedido listo para revisión manual",
];

export const CATEGORY_TILES = [
  {
    filter: "Todos",
    eyebrow: "Todo",
    title: "Ver colección completa",
    image: "/assets/hero-sunset.png",
    wide: true,
  },
  {
    filter: "Bikinis",
    eyebrow: "Bikinis",
    title: "Silhuetas suaves y luminosas",
    image: "/assets/category-bikinis.png",
  },
  {
    filter: "Enterizos",
    eyebrow: "Enterizos",
    title: "Elegancia que se siente fácil",
    image: "/assets/category-enterizos.png",
  },
  {
    filter: "Pareos",
    eyebrow: "Pareos",
    title: "Los asoleadores para completar el look",
    image: "/assets/category-pareos.png",
  },
  {
    filter: "Accesorios",
    eyebrow: "Próximamente",
    title: "Resort Wear y accesorios",
    image: "/assets/category-accessories.png",
  },
];

export const FILTERS = ["Todos", "Bikinis", "Enterizos", "Pareos", "Accesorios"];

export const FEATURED_IDS = [
  "bikini-marfil-naciente",
  "enterizo-marfil",
  "pareo-atardecer",
  "bikini-coral-brisa",
];

export const NEW_COLLECTION_IDS = [
  "bikini-marfil-naciente",
  "enterizo-marfil",
  "pareo-atardecer",
];

export const PRODUCTS = [
  {
    id: "bikini-marfil-naciente",
    name: "Bikini Marfil Naciente",
    category: "Bikinis",
    price: 189000,
    availability: "En stock",
    status: "available",
    description:
      "Un bikini limpio y luminoso, pensado para abrir la colección con una sensación suave, fresca y sofisticada.",
    colors: ["Marfil", "Arena", "Coral"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-bikinis.png", "/assets/hero-sunset.png", "/assets/category-pareos.png"],
    featured: true,
    fresh: true,
  },
  {
    id: "bikini-coral-brisa",
    name: "Bikini Coral Brisa",
    category: "Bikinis",
    price: 192000,
    availability: "En stock",
    status: "available",
    description: "Una versión con un acento más cálido, ideal para una estética de atardecer con toque de coral.",
    colors: ["Coral", "Arena"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-bikinis.png", "/assets/category-accessories.png", "/assets/hero-sunset.png"],
    featured: true,
    fresh: true,
  },
  {
    id: "bikini-marea-doble",
    name: "Bikini Marea Doble",
    category: "Bikinis",
    price: 186000,
    availability: "Últimas unidades",
    status: "available",
    description:
      "Una silueta atemporal con una lectura más relajada, pensada para mezclar minimalismo y elegancia.",
    colors: ["Marfil", "Chocolate"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-bikinis.png", "/assets/hero-sunset.png", "/assets/category-pareos.png"],
    featured: true,
    fresh: false,
  },
  {
    id: "enterizo-marfil",
    name: "Enterizo Marfil",
    category: "Enterizos",
    price: 239000,
    availability: "En stock",
    status: "available",
    description: "Un enterizo elegante con líneas limpias y una presencia serena para resort, playa o piscina.",
    colors: ["Marfil", "Arena", "Azul océano"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-enterizos.png", "/assets/hero-sunset.png", "/assets/category-accessories.png"],
    featured: true,
    fresh: true,
  },
  {
    id: "enterizo-noche-marina",
    name: "Enterizo Noche Marina",
    category: "Enterizos",
    price: 245000,
    availability: "En stock",
    status: "available",
    description:
      "Una pieza más profunda y elegante, ideal para quienes buscan una presencia sobria y muy sofisticada.",
    colors: ["Azul océano", "Chocolate"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-enterizos.png", "/assets/category-accessories.png", "/assets/hero-sunset.png"],
    featured: false,
    fresh: true,
  },
  {
    id: "enterizo-arena-serena",
    name: "Enterizo Arena Serena",
    category: "Enterizos",
    price: 229000,
    availability: "Últimas unidades",
    status: "available",
    description:
      "Suave, depurado y muy fácil de llevar, con una lectura cálida y minimalista para el día a día del verano.",
    colors: ["Arena", "Marfil"],
    sizes: ["S", "M", "L"],
    images: ["/assets/category-enterizos.png", "/assets/hero-sunset.png", "/assets/category-pareos.png"],
    featured: false,
    fresh: false,
  },
  {
    id: "pareo-atardecer",
    name: "Pareo Atardecer",
    category: "Pareos",
    price: 119000,
    availability: "En stock",
    status: "available",
    description:
      "Un pareo liviano y versátil que suma movimiento, textura y una sensación muy resort a cualquier look.",
    colors: ["Coral atardecer", "Arena"],
    sizes: ["Única"],
    images: ["/assets/category-pareos.png", "/assets/hero-sunset.png", "/assets/category-accessories.png"],
    featured: true,
    fresh: true,
  },
  {
    id: "pareo-coral",
    name: "Pareo Coral",
    category: "Pareos",
    price: 119000,
    availability: "En stock",
    status: "available",
    description: "Una versión luminosa para acompañar bikinis y enterizos con un punto de color atardecer.",
    colors: ["Coral", "Marfil"],
    sizes: ["Única"],
    images: ["/assets/category-pareos.png", "/assets/hero-sunset.png", "/assets/category-bikinis.png"],
    featured: false,
    fresh: true,
  },
  {
    id: "accesorios-proximamente",
    name: "Resort Accessories",
    category: "Accesorios",
    price: null,
    availability: "Próximamente",
    status: "soon",
    description:
      "La próxima cápsula de accesorios y resort wear de Asolea, inspirada en texturas naturales y acabados suaves.",
    colors: ["Marfil", "Arena", "Chocolate"],
    sizes: [],
    images: ["/assets/category-accessories.png", "/assets/category-pareos.png", "/assets/hero-sunset.png"],
    featured: false,
    fresh: false,
  },
];

export const FAQS = [
  {
    question: "¿Qué talla soy?",
    answer:
      "Te recomendamos guiarte por la tabla de medidas y, si dudas entre dos tallas, escribirnos por WhatsApp para ayudarte a elegir la mejor opción.",
  },
  {
    question: "¿Cómo cuidar el bikini?",
    answer:
      "Lava la prenda a mano con agua fría, usa jabón suave, evita retorcerla y sécala a la sombra para conservar color, forma y elasticidad.",
  },
  {
    question: "¿Cuánto demora el envío?",
    answer:
      "El tiempo depende de la ciudad y de la disponibilidad del producto. Al finalizar la compra revisamos tu pedido y te confirmamos el plazo exacto junto con el valor del envío.",
  },
  {
    question: "¿Puedo hacer cambios?",
    answer:
      "Sí, siempre que la prenda no haya sido usada y se mantenga en perfecto estado. Revisa con nosotros la disponibilidad de tallas y las condiciones del cambio antes de enviarlo.",
  },
];

export const INSTAGRAM_POSTS = [
  {
    title: "Colección marfil",
    caption: "Editorial de inicio de temporada",
    image: "/assets/category-bikinis.png",
  },
  {
    title: "Atardecer",
    caption: "Texturas cálidas y suaves",
    image: "/assets/hero-sunset.png",
  },
  {
    title: "Enterizos",
    caption: "Siluetas limpias",
    image: "/assets/category-enterizos.png",
  },
  {
    title: "Pareos",
    caption: "Movimiento ligero",
    image: "/assets/category-pareos.png",
  },
  {
    title: "Accesorios",
    caption: "Lo que viene después",
    image: "/assets/category-accessories.png",
  },
  {
    title: "Resort edit",
    caption: "Vacaciones en clave Asolea",
    image: "/assets/category-pareos.png",
  },
];

export const COLOR_SWATCHES = {
  Marfil: "#f8f5ef",
  Arena: "#eaddc8",
  Coral: "#e98a72",
  "Coral atardecer": "#e98a72",
  "Azul océano": "#3f6f88",
  Chocolate: "#4b3a32",
};

export function formatMoney(value) {
  if (typeof value !== "number") {
    return "Próximamente";
  }

  return CURRENCY.format(value);
}

export function getColorHex(label) {
  return COLOR_SWATCHES[label] || "#c7a46a";
}
