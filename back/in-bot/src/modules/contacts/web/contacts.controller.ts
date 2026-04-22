import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { CreateContactCommand } from '../application/commands/create-contact.command';
import { UpdateContactCommand } from '../application/commands/update-contact.command';
import { DeleteContactCommand } from '../application/commands/delete-contact.command';
import { GetContactsQuery } from '../application/queries/get-contacts.query';
import { GetContactByIdQuery } from '../application/queries/get-contact-by-id.query';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createContact(@Req() req: any, @Body() dto: RegisterDto) {
    return this.commandBus.execute(
      new CreateContactCommand(
        req.user.id,
        dto.name,
        dto.email,
        dto.phone,
        {
          cep: dto.address.cep,
          street: dto.address.street || '',
          neighborhood: dto.address.neighborhood || '',
          city: dto.address.city || '',
          state: dto.address.state || '',
          number: dto.address.number,
          observation: dto.address.observation,
        },
      ),
    );
  }

  @Get()
  async getContacts(@Req() req: any) {
    return this.queryBus.execute(new GetContactsQuery(req.user.id));
  }

  @Get(':id')
  async getContactById(@Req() req: any, @Param('id') id: string) {
    return this.queryBus.execute(new GetContactByIdQuery(id, req.user.id));
  }

  @Put(':id')
  async updateContact(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDto) {
    return this.commandBus.execute(
      new UpdateContactCommand(
        id,
        req.user.id,
        dto.name,
        dto.email,
        dto.phone,
        dto.address,
      ),
    );
  }

  @Delete(':id')
  async deleteContact(@Req() req: any, @Param('id') id: string) {
    return this.commandBus.execute(new DeleteContactCommand(id, req.user.id));
  }
}