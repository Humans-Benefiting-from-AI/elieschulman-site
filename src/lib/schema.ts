/**
 * JSON-LD Schema Markup Generators
 * Used for SEO and rich snippets in search results
 */

export interface SchemaOption {
  type: 'Person' | 'Article' | 'CreativeWork' | 'Organization';
  data: Record<string, any>;
}

export function generatePersonSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Elie Schulman',
    url: 'https://elieschulman.com',
    sameAs: [
      'https://emesnewsletter.substack.com',
      'https://www.cohortlearninglabs.org/'
    ],
    description: 'Writer, educator, and translator examining language, judgment, and learning',
    jobTitle: 'Writer & Educator',
    knowsAbout: ['Language', 'Learning', 'Group Process', 'Jewish Thought', 'Translation']
  };
  return JSON.stringify(schema);
}

export function generateArticleSchema(title: string, description: string, datePublished?: string, dateModified?: string): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: 'Elie Schulman',
      url: 'https://elieschulman.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elie Schulman',
      url: 'https://elieschulman.com'
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified })
  };
  return JSON.stringify(schema);
}

export function generateBookSchema(title: string, description: string, coverImage?: string): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    description: description,
    author: {
      '@type': 'Person',
      name: 'Elie Schulman',
      url: 'https://elieschulman.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elie Schulman',
      url: 'https://elieschulman.com'
    },
    ...(coverImage && { image: coverImage })
  };
  return JSON.stringify(schema);
}

export function generateOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cohort Learning Labs',
    url: 'https://www.cohortlearninglabs.org',
    founder: {
      '@type': 'Person',
      name: 'Elie Schulman'
    },
    sameAs: [
      'https://emesnewsletter.substack.com'
    ],
    description: 'A group learning and facilitation organization'
  };
  return JSON.stringify(schema);
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
  return JSON.stringify(schema);
}
