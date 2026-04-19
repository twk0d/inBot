import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('contacts')
export class ContactsController {

    @Post()
    createContact() { }

    @Get()
    getContacts() { }

    @Get(':id')
    getContactById() { }

    @Put(':id')
    updateContact() { }

    @Delete(':id')
    deleteContact() { }

}