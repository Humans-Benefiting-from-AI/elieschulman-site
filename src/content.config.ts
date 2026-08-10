import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const teachings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teachings' }),
  schema: z.object({
    title: z.string(),
    title_html: z.string().optional(),
    description: z.string(),
    description_html: z.string().optional(),
    eyebrow: z.string().optional(),
    lede: z.string().optional(),
    author: z.string().default('Elie Schulman'),
    meta: z.string().optional(),
    coverImage: z.string().optional(),
    back_link: z.string().optional(),

    // Multi-modal formats
    text_epub: z.string().optional(),
    text_pdf: z.string().optional(),
    audio_only: z.string().optional(),
    video_face: z.string().optional(),
    video_graphics: z.string().optional(),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    lede: z.string().optional(),
    order: z.number().optional(),
  }),
});

const maimonides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/maimonides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    lede: z.string().optional(),
    order: z.number().optional(),
  }),
});

const audio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/audio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(['podcasts', 'lectures', 'interviews']),
    date: z.coerce.date().optional(),
    url: z.string().optional(),
    audio_file: z.string().optional(),
  }),
});

export const collections = {
  teachings,
  essays,
  maimonides,
  audio,
};
