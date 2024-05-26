import { Controller, Param, UseInterceptors, Get, Post, Body, Delete, HttpCode } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorDto } from './profesor.dto/profesor.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('profesores')
export class ProfesorController {
    constructor(private readonly profesorService: ProfesorService) {}

    @Get(':profesorId')
    async findProfesorById(@Param('profesorId') profesorId: number) {
        return await this.profesorService.findProfesorById(profesorId);
    }

    @Post()
    async crearProfesor(@Body() profesorDto: ProfesorDto) {
        const prof: ProfesorEntity = plainToInstance(ProfesorEntity, profesorDto);
        return await this.profesorService.crearProfesor(prof);
    }

    @Delete(':profesorId')
    @HttpCode(204)  
    async eliminarProfesor(@Param('profesorId') profesorId: number) {
        return await this.profesorService.eliminarProfesor(profesorId);
    }
}
