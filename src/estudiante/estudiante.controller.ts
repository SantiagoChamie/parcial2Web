import { Controller, Param, UseInterceptors, Get, Post, Body} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('estudiantes')
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Get(':estudianteId')
    async findEstudianteById(@Param('estudianteId') estudianteId: number) {
        return await this.estudianteService.findEstudianteById(estudianteId);
    }

    @Post()
    async crearEstudiante(@Body() estudianteDto: EstudianteDto) {
        const student: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
        return await this.estudianteService.crearEstudiante(student);
    }
}
