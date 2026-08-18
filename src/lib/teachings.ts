import { existsSync } from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Teaching = CollectionEntry<'teachings'>;

/** Published (non-draft) teachings, sorted by order then title. */
export async function getPublishedTeachings(): Promise<Teaching[]> {
  const all = await getCollection('teachings');
  return sortTeachings(all.filter((t) => !t.data.draft));
}

export function sortTeachings(entries: Teaching[]): Teaching[] {
  return [...entries].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.data.title.localeCompare(b.data.title);
  });
}

export function teachingsWithEpub(entries: Teaching[]): Teaching[] {
  return entries.filter((t) => Boolean(t.data.text_epub));
}

export function teachingsInSection(
  entries: Teaching[],
  section: Teaching['data']['section'],
): Teaching[] {
  return entries.filter((t) => t.data.section === section);
}

/**
 * Prefer collection coverImage; otherwise try conventional public cover files.
 */
export function teachingCoverUrl(entry: Teaching): string | undefined {
  if (entry.data.coverImage) return entry.data.coverImage;
  const candidates = [
    `/books/${entry.id}/cover.jpg`,
    `/books/${entry.id}/cover.jpeg`,
    `/books/${entry.id}/cover.png`,
    `/books/${entry.id}/cover.webp`,
  ];
  for (const url of candidates) {
    if (existsSync(path.join(process.cwd(), 'public', url.slice(1)))) return url;
  }
  return undefined;
}
