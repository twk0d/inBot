import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { AddressSchema } from "../../../../shared/schemas/address.schema";

const schema = z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    email: z.email(),
    address: AddressSchema,
});

export class RegisterDto extends createZodDto(schema) { }