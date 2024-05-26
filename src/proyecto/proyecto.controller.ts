import { Controller, UseInterceptors, Post, Body} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoDto } from './proyecto.dto/proyecto.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('proyectos')
export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService) {}

    @Post()
    async crearProyecto(@Body() proyectoDto: ProyectoDto) {
        const project: ProyectoEntity = plainToInstance(ProyectoEntity, proyectoDto);
        return await this.proyectoService.crearProyecto(project);
    }
}
