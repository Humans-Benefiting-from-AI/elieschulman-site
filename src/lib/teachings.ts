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

/** Prefer collection coverImage; fall back to conventional cover paths. */
export function teachingCoverUrl(entry: Teaching): string | undefined {
  if (entry.data.coverImage) return entry.data.coverImage;
  return undefined;
}
