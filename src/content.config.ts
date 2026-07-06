import { defineCollection, z } from "astro:content";

const works = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.number(),
    medium: z.string(),
    dimensions: z.string(),
    cover: z.string(),
    statement: z.string(),
    series: z.string().optional(),
    featured: z.boolean().default(false),
    availableAsPrint: z.boolean().default(false),
  }),
});

const series = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    cover: z.string(),
    description: z.string(),
    order: z.number().default(0),
  }),
});

const exhibitions = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    location: z.string(),
    period: z.string(),
    cover: z.string(),
    description: z.string(),
    status: z.enum(["past", "current", "upcoming"]).default("past"),
  }),
});

export const collections = {
  works,
  series,
  exhibitions,
};