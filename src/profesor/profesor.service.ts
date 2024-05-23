import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProfesorService {
    constructor(
        @InjectRepository(ProfesorEntity)
        private readonly profesorRepository: Repository<ProfesorEntity>
    ){}
    async findProfesorById(id: number): Promise<ProfesorEntity> {
        const profesor: ProfesorEntity = await this.profesorRepository.findOne({where: {id}, relations: ["propuestas"] } );
        if (!profesor)
          throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
   
        return profesor;
    }
    async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
        return await this.profesorRepository.save(profesor);
    }
    async eliminarProfesor(id: number) {
        const profesor: ProfesorEntity = await this.profesorRepository.findOne({where:{id}});
        if (!profesor)
          throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.profesorRepository.remove(profesor);
    }
}
