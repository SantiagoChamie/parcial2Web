import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { PropuestaEntity } from '../propuesta/propuesta.entity/propuesta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProfesorService {
    constructor(
        @InjectRepository(ProfesorEntity)
        private readonly profesorRepository: Repository<ProfesorEntity>,
        @InjectRepository(PropuestaEntity)
        private readonly propuestaRepository: Repository<PropuestaEntity>
    ){}
    async findProfesorById(id: number): Promise<ProfesorEntity> {
        const profesor: ProfesorEntity = await this.profesorRepository.findOne({where: {id}, relations: ["propuestas"] } );
        if (!profesor)
          throw new BusinessLogicException("The professor with the given id was not found", BusinessError.NOT_FOUND);
   
        return profesor;
    }
    async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
        if(profesor.grupoDeInvestigacion != "TICSW" && profesor.grupoDeInvestigacion != "IMAGINE" && profesor.grupoDeInvestigacion != "COMIT")
            throw new BusinessLogicException("The professor must belong to TICSW, IMAGINE or COMIT", BusinessError.PRECONDITION_FAILED);
        return await this.profesorRepository.save(profesor);
    }
    async eliminarProfesor(id: number) {
        const cedula = id;
        const profesor1: ProfesorEntity = await this.profesorRepository.findOne({where:{id}, relations: ["propuestas"]});
        const profesor2: ProfesorEntity = await this.profesorRepository.findOne({where:{cedula}, relations: ["propuestas"]});
        let profesor: ProfesorEntity;

        if (!profesor1 && !profesor2)
          throw new BusinessLogicException("The professor with the given id or cedula was not found", BusinessError.NOT_FOUND);        
        else if (!profesor1)
            profesor = profesor2;
        else 
            profesor = profesor1;
        
        const propuestas: PropuestaEntity[] = profesor.propuestas;

        for (let i = 0; i < propuestas.length; i++) {
            const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({ where: { id: propuestas[i].id }, relations: ["proyecto"] });
            if (propuesta.proyecto) {
                throw new BusinessLogicException("The professor with the given id or cedula has a proposal with an active project", BusinessError.PRECONDITION_FAILED);
            }
        }
        await this.profesorRepository.remove(profesor);
    }
}
