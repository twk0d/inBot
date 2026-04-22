import { z } from "zod";

export const AddressSchema = z.object({
  cep: z.string().length(8),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  number: z.number().int().positive(),
  observation: z.string().optional(),
});