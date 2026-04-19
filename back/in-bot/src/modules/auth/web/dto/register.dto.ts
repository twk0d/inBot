import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(2),
});

export class RegisterDto extends createZodDto(schema) { }