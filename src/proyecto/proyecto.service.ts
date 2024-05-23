import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProyectoService {
    constructor(
        @InjectRepository(ProyectoEntity)
        private readonly proyectoRepository: Repository<ProyectoEntity>
    ){}
    async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
        if(proyecto.fechaInicio > proyecto.fechaFin)
            throw new BusinessLogicException("The proyecto's starting date cannot happen later than it's ending date", BusinessError.PRECONDITION_FAILED);
        return await this.proyectoRepository.save(proyecto);
    }
}
