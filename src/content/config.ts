import { z, defineCollection } from 'astro:content';

const teachings = defineCollection({
  type: 'content',
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

export const collections = {
  teachings,
};
