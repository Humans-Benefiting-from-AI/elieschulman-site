/**
 * Content categorization and filtering utilities
 */

export interface ContentItem {
  title: string;
  description: string;
  url: string;
  tags: string[];
  category?: string;
}

export const WRITING_TAGS = {
  language: { name: 'Language', color: '#c9a84c' },
  judgment: { name: 'Judgment', color: '#c9a84c' },
  learning: { name: 'Learning', color: '#c9a84c' },
  group: { name: 'Group Process', color: '#c9a84c' },
  torah: { name: 'Torah', color: '#c9a84c' },
  translation: { name: 'Translation', color: '#c9a84c' },
  philosophy: { name: 'Philosophy', color: '#c9a84c' },
};

export function filterContentByTags(
  items: ContentItem[],
  selectedTags: string[]
): ContentItem[] {
  if (selectedTags.length === 0) return items;
  return items.filter(item =>
    selectedTags.some(tag => item.tags.includes(tag))
  );
}

export function getAllUniqueTagsFromContent(items: ContentItem[]): string[] {
  const tagSet = new Set<string>();
  items.forEach(item => {
    item.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
