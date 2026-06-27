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
    'https://www.instagram.com/jeje.rgb',
    'https://www.tiktok.com/@jeje.rgb',
    'https://www.facebook.com/jeje537',
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
    'marketing, branding, reclame, website, web dev, editare video, agenție de publicitate, agenție de marketing, agenție de producție publicitară, agenție de digital marketing, designer grafic, video editor, logo design, identitate vizuală, social media, Hunedoara, Valea Jiului, Petroșani, Vulcan, Lupeni, Uricani, Aninoasa, România',
  ogImageAlt:
    'JEJE.RBG — agenție multimedia de branding, web development, editare video și marketing din Valea Jiului, Hunedoara',
  // 1200x630 OG image generated on the fly by Cloudinary from an existing asset.
  ogImage:
    'https://res.cloudinary.com/dphdjjfvr/image/upload/v1782541753/favicon_dxabwv.png',
};

// Focused landing pages — same portfolio sections, unique head/meta for search intent.
export const SERVICE_PAGES = [
  {
    slug: 'branding',
    section: 'branding',
    title:
      'Branding & Logo Design Valea Jiului, Hunedoara | JEJE.RBG',
    description:
      'Branding, identitate vizuală și design logo pentru afaceri din Valea Jiului, Hunedoara și România. Portofoliu Allma Road, Spiral Tribe, Dreea și altele.',
    keywords:
      'branding, logo, identitate vizuală, design logo, brand identity, agenție branding, Valea Jiului, Hunedoara, Petroșani, România',
    schemaName: 'Branding și identitate vizuală',
    schemaDescription:
      'Servicii de branding, logo design și identitate vizuală pentru companii din Valea Jiului, județul Hunedoara și la nivel național în România.',
  },
  {
    slug: 'design-grafic',
    section: 'graphic-design',
    title:
      'Design Grafic & Reclame — Agenție Creativă Valea Jiului | JEJE.RBG',
    description:
      'Designer grafic pentru postere, coperți, materiale promoționale și reclame. Producție publicitară din Valea Jiului pentru clienți din toată România.',
    keywords:
      'design grafic, designer grafic, reclame, materiale promoționale, producție publicitară, afișe, cover art, Valea Jiului, Hunedoara, România',
    schemaName: 'Design grafic și reclame',
    schemaDescription:
      'Design grafic, materiale promoționale și reclame pentru social media, evenimente și campanii publicitare în Valea Jiului și România.',
  },
  {
    slug: 'editare-video',
    section: 'video-social',
    title:
      'Editare Video & Social Media — Valea Jiului, România | JEJE.RBG',
    description:
      'Video editor și strateg social media: conținut short-form și long-form cu milioane de vizualizări. Editare video profesională din Valea Jiului.',
    keywords:
      'editare video, video editor, social media, TikTok, Instagram Reels, YouTube, conținut video, Valea Jiului, Hunedoara, România',
    schemaName: 'Editare video și social media',
    schemaDescription:
      'Editare video profesională, direcție de conținut și strategie social media pentru branduri din Valea Jiului și România.',
  },
  {
    slug: 'web-development',
    section: 'web-dev',
    title:
      'Dezvoltare Website & Web Dev SEO — Valea Jiului | JEJE.RBG',
    description:
      'Website-uri rapide, optimizate SEO și mobile-first. Dezvoltare web din Valea Jiului — spiraltribe.ro, dreea.art și proiecte custom.',
    keywords:
      'web development, dezvoltare website, creare site, site web, landing page, SEO, web dev, Valea Jiului, Hunedoara, România',
    schemaName: 'Dezvoltare website',
    schemaDescription:
      'Dezvoltare de website-uri rapide, optimizate SEO și adaptate mobil, pentru afaceri din Valea Jiului, Hunedoara și România.',
  },
  {
    slug: 'marketing-digital',
    section: 'servicii',
    title:
      'Marketing Digital & Agenție de Publicitate — Valea Jiului | JEJE.RBG',
    description:
      'Agenție de marketing digital și publicitate din Valea Jiului. Campanii, reclame, branding, web și video — un singur partener multimedia.',
    keywords:
      'marketing digital, agenție de publicitate, agenție de marketing, campanii publicitare, digital marketing, Valea Jiului, Hunedoara, România',
    schemaName: 'Marketing digital și publicitate',
    schemaDescription:
      'Servicii complete de marketing digital, campanii publicitare și prezență online pentru afaceri din Valea Jiului și România.',
  },
];

export const LOCAL_LANDING = {
  slug: 'agentie-publicitate-valea-jiului',
  title:
    'Agenție de Publicitate & Marketing Valea Jiului, Hunedoara | JEJE.RBG',
  description:
    'Agenție multimedia de publicitate și marketing din Valea Jiului, județul Hunedoara. Branding, logo, web dev, editare video, reclame — servicii pentru România.',
  keywords:
    'agenție de publicitate, agenție de marketing, agenție multimedia, Valea Jiului, Hunedoara, Petroșani, Vulcan, Lupeni, branding, web dev, editare video, România',
  schemaName: 'Agenție de publicitate Valea Jiului',
  schemaDescription:
    'Agenție de publicitate și marketing multimedia din Valea Jiului, județul Hunedoara, cu servicii de branding, web, video și campanii pentru clienți din România.',
  sections: ['services', 'proof', 'faq', 'contact'],
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
