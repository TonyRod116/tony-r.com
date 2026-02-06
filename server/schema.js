import { z } from 'zod'

const projectTypeEnum = z.enum(['baño', 'cocina', 'integral', 'pintura', 'suelo', 'otros'])

export const quoteDraftSchema = z.object({
  lead: z.object({
    name: z.string(),
    phone: z.string().optional(),
    city: z.string().optional(),
    projectType: projectTypeEnum,
    sqm: z.number().optional(),
    targetBudget: z.number().optional(),
    notes: z.string().optional(),
  }),
  missingQuestions: z.array(z.string()),
  siteVisitChecklist: z.array(z.string()),
  budgetDraft: z.object({
    currency: z.literal('EUR'),
    assumptions: z.array(z.string()),
    exclusions: z.array(z.string()),
    lineItems: z.array(z.object({
      category: z.string(),
      item: z.string(),
      qty: z.number().optional(),
      unit: z.string().optional(),
      rangeMin: z.number(),
      rangeMax: z.number(),
      notes: z.string().optional(),
    })),
    totalMin: z.number(),
    totalMax: z.number(),
  }),
  whatsappMessage: z.string(),
})
