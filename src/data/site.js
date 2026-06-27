// Central source of truth for business info, SEO and FAQ (AEO).
// Keep visible FAQ content and JSON-LD FAQPage in sync by importing this in both.

export const SITE = {
  url: 'https://jeje.ro',
  brand: 'JEJE.RBG',
  personName: 'Nica Dragoș',
  jobTitle: 'Multimedia Designer & Web Developer',
  email: 'nicadragoj537@gmail.com',
  phone: '+40729592767',
  // Geo (GEO/local SEO)
  region: 'Valea Jiului',
  county: 'Hunedoara',
  country: 'România',
  countryCode: 'RO',
  geo: { lat: 45.41, lng: 23.36 }, // Valea Jiului approx.
  sameAs: [
    'https://www.instagram.com/',
    'https://www.tiktok.com/',
    'https://www.youtube.com/',
  ],
  services: [
    'Branding',
    'Design grafic',
    'Web development',
    'Editare video',
    'Marketing',
    'Reclame',
    'Producție publicitară',
    'Digital marketing',
  ],
};

export const SEO = {
  titleRo:
    'JEJE.RBG | Agenție Multimedia, Branding, Web Dev & Editare Video — Valea Jiului, Hunedoara',
  descriptionRo:
    'Agenție de publicitate și marketing din Valea Jiului, Hunedoara. Branding, design grafic, dezvoltare website, editare video, reclame și digital marketing. 4M+ vizualizări generate.',
  descriptionEn:
    'Advertising & marketing studio in Valea Jiului, Hunedoara, Romania. Branding, graphic design, web development, video editing, ads and digital marketing. 4M+ views generated.',
  keywords:
    'marketing, branding, reclame, website, web dev, editare video, agenție de publicitate, agenție de marketing, agenție de producție publicitară, agenție de digital marketing, designer grafic, video editor, Valea Jiului, Hunedoara, România',
  // 1200x630 OG image generated on the fly by Cloudinary from an existing asset.
  ogImage:
    'https://res.cloudinary.com/dphdjjfvr/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/v1778599992/social-media-post_dqdfg1.jpg',
};

// FAQ — written as natural questions/answers for Answer Engine Optimization.
export const FAQ = [
  {
    q_ro: 'Ce servicii oferă JEJE.RBG?',
    q_en: 'What services does JEJE.RBG offer?',
    a_ro: 'JEJE.RBG oferă branding și identitate vizuală, design grafic, dezvoltare de website-uri, editare video, strategie de conținut pentru social media, reclame și digital marketing — un partener multimedia complet pentru afaceri din Valea Jiului, Hunedoara și din toată România.',
    a_en: 'JEJE.RBG offers branding and visual identity, graphic design, website development, video editing, social media content, ads and digital marketing — a complete multimedia partner for businesses in Valea Jiului, Hunedoara and across Romania.',
  },
  {
    q_ro: 'Unde este localizat designerul?',
    q_en: 'Where is the designer located?',
    a_ro: 'Sunt localizat în Valea Jiului, județul Hunedoara, și lucrez atât cu clienți locali, cât și la distanță, în toată România.',
    a_en: 'I am based in Valea Jiului, Hunedoara county, working with both local and remote clients across Romania.',
  },
  {
    q_ro: 'Poți emite factură fiscală?',
    q_en: 'Can you issue a legal invoice?',
    a_ro: 'Da. Lucrez legal și pot emite factură fiscală pentru toate serviciile de marketing, branding, web development și producție publicitară.',
    a_en: 'Yes. I work legally and can issue a fiscal invoice for all marketing, branding, web development and advertising production services.',
  },
  {
    q_ro: 'Construiești și website-uri?',
    q_en: 'Do you build websites too?',
    a_ro: 'Da. Construiesc website-uri rapide, optimizate SEO și adaptate pentru mobil, de la landing page-uri la platforme complete — vezi proiectele spiraltribe.ro și dreea.art.',
    a_en: 'Yes. I build fast, SEO-optimized and mobile-friendly websites, from landing pages to complete platforms — see the spiraltribe.ro and dreea.art projects.',
  },
  {
    q_ro: 'Ce rezultate ai obținut pentru clienți?',
    q_en: 'What results have you achieved for clients?',
    a_ro: 'Conținutul video și social media pe care l-am produs și editat a generat peste 10 milioane de vizualizări pe TikTok, Instagram și YouTube.',
    a_en: 'The video and social media content I produced and edited has generated over 10 million views across TikTok, Instagram and YouTube în cursul anului 2026.',
  },
];
