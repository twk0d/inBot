import { z } from "zod";

export const AddressSchema = z.object({
    cep: z.string().length(8),
    street: z.string(),
    city: z.string(),
    state: z.string().length(2),
});