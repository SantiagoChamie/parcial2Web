import { Controller, Param, UseInterceptors, Get, Post, Body, Delete, HttpCode } from '@nestjs/common';
import { PropuestaService } from './propuesta.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';
import { PropuestaDto } from './propuesta.dto/propuesta.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('propuestas')
export class PropuestaController {
    constructor(private readonly propuestaService: PropuestaService) {}

    @Get()
    async findAllPropuesta() {
        return await this.propuestaService.findAllPropuesta();
    }
    
    @Get(':propuestaId')
    async findPropuestaById(@Param('propuestaId') propuestaId: number) {
        return await this.propuestaService.findPropuestaById(propuestaId);
    }

    @Post()
    async crearPropuesta(@Body() propuestaDto: PropuestaDto) {
        const propuesta: PropuestaEntity = plainToInstance(PropuestaEntity, propuestaDto);
        return await this.propuestaService.crearPropuesta(propuesta);
    }

    @Delete(':propuestaId')
    @HttpCode(204)  
    async deletePropuesta(@Param('propuestaId') propuestaId: number) {
        return await this.propuestaService.deletePropuesta(propuestaId);
    }
}
