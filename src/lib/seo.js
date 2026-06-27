import { SITE, SEO, FAQ, SERVICE_PAGES, LOCAL_LANDING } from '../data/site.js';

/** @param {string} path */
export function absoluteUrl(path = '/') {
  return new URL(path, SITE.url).href;
}

/**
 * @param {{
 *   path?: string;
 *   title?: string;
 *   description?: string;
 *   service?: { name: string; description: string; slug: string } | null;
 * }} [options]
 */
export function buildJsonLd(options = {}) {
  const {
    path = '/',
    title = SEO.titleRo,
    description = SEO.descriptionRo,
    service = null,
  } = options;

  const pageUrl = absoluteUrl(path);
  const isHome = path === '/';

  const professionalService = {
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE.url}/#business`,
    name: SITE.brand,
    alternateName: [
      `${SITE.personName} — ${SITE.jobTitle}`,
      'JEJE.RBG Agenție Publicitate',
      'Agenție multimedia Valea Jiului',
    ],
    description: SEO.descriptionRo,
    url: SITE.url,
    image: SEO.ogImage,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    priceRange: '$$',
    founder: { '@id': `${SITE.url}/#person` },
    areaServed: [
      { '@type': 'Place', name: SITE.region },
      { '@type': 'AdministrativeArea', name: SITE.county },
      { '@type': 'AdministrativeArea', name: 'Valea Jiului' },
      { '@type': 'Country', name: SITE.country },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.region,
      addressRegion: SITE.county,
      addressCountry: SITE.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    sameAs: SITE.sameAs,
    availableLanguage: [{ '@type': 'Language', name: 'Romanian', alternateName: 'ro' }],
    knowsAbout: [
      'Branding',
      'Logo design',
      'Design grafic',
      'Agenție de publicitate',
      'Marketing digital',
      'Editare video',
      'Dezvoltare website',
      'Social media marketing',
      ...SITE.services,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicii multimedia JEJE.RBG',
      itemListElement: SITE.services.map((name, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name,
          provider: { '@id': `${SITE.url}/#business` },
          areaServed: { '@type': 'Country', name: SITE.country },
        },
      })),
    },
    potentialAction: {
      '@type': 'CommunicateAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `mailto:${SITE.email}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    },
  };

  const person = {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.personName,
    alternateName: SITE.brand,
    jobTitle: SITE.jobTitle,
    url: SITE.url,
    worksFor: { '@id': `${SITE.url}/#business` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.region,
      addressRegion: SITE.county,
      addressCountry: SITE.countryCode,
    },
    knowsAbout: SITE.services,
    sameAs: SITE.sameAs,
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.brand,
    description: SEO.descriptionRo,
    inLanguage: 'ro-RO',
    publisher: { '@id': `${SITE.url}/#business` },
    ...(isHome && {
      hasPart: [
        {
          '@type': 'WebPage',
          name: LOCAL_LANDING.schemaName,
          url: absoluteUrl(`/${LOCAL_LANDING.slug}`),
        },
        ...SERVICE_PAGES.map((p) => ({
          '@type': 'WebPage',
          name: p.schemaName,
          url: absoluteUrl(`/servicii/${p.slug}`),
        })),
      ],
    }),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#faq`,
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q_ro,
      acceptedAnswer: { '@type': 'Answer', text: f.a_ro },
    })),
  };

  /** @type {Record<string, unknown>[]} */
  const graph = [professionalService, person, website];

  if (isHome) {
    graph.push(faqPage);
    graph.push({
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      isPartOf: { '@id': `${SITE.url}/#website` },
      about: { '@id': `${SITE.url}/#business` },
      inLanguage: 'ro-RO',
      primaryImageOfPage: { '@type': 'ImageObject', url: SEO.ogImage },
    });
  }

  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: service.name,
      description: service.description,
      url: pageUrl,
      provider: { '@id': `${SITE.url}/#business` },
      areaServed: [
        { '@type': 'Place', name: SITE.region },
        { '@type': 'AdministrativeArea', name: SITE.county },
        { '@type': 'Country', name: SITE.country },
      ],
      serviceType: service.name,
    });

    graph.push({
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      isPartOf: { '@id': `${SITE.url}/#website` },
      about: { '@id': `${pageUrl}#service` },
      inLanguage: 'ro-RO',
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    });

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Acasă',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: service.name,
          item: pageUrl,
        },
      ],
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
