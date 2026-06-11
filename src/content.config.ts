import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      detail: z.string(),
      date: z.date(),
      sortOrder: z.number(),
      featured: z.boolean().default(false),
      thumbnail: image().optional(),
      heroImage: image().optional(),
      techStack: z.array(z.string()),
      tags: z.array(z.string()).max(4),
      category: z.enum(['hackathon', 'personal', 'competition']),
      teamSize: z.number().optional(),
      role: z.string(),
      github: z.string().url().optional(),
      liveDemo: z.string().url().optional().or(z.literal('')),
      skills: z.array(z.string()),
    }),
});

export const collections = { projects };
