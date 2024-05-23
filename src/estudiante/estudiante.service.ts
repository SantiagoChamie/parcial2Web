import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>
    ){}
    async findEstudianteById(id: number): Promise<EstudianteEntity> {
        const estudiante: EstudianteEntity = await this.estudianteRepository.findOne({where: {id}, relations: ["creador", "discusion"] } );
        if (!estudiante)
          throw new BusinessLogicException("The estudiante with the given id was not found", BusinessError.NOT_FOUND);
   
        return estudiante;
    }
    async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
        return await this.estudianteRepository.save(estudiante);
    }
}
