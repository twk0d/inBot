import { createZodDto } from "nestjs-zod";
import { AddressSchema } from "../../../../shared/schemas/address.schema";

export class AddressDto extends createZodDto(AddressSchema) { }