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
        if(profesor.grupoDeInvestigacion != "TICSW" && profesor.grupoDeInvestigacion != "IMAGINE" && profesor.grupoDeInvestigacion != "COMIT")
            throw new BusinessLogicException("The profesor must belong to TICSW, IMAGINE or COMIT", BusinessError.PRECONDITION_FAILED);
        return await this.profesorRepository.save(profesor);
    }
    async eliminarProfesor(id: number) {
        const cedula = id;
        const profesor: ProfesorEntity = await this.profesorRepository.findOne({where:{id}, relations: ["propuestas"]});
        const profesor1: ProfesorEntity = await this.profesorRepository.findOne({where:{cedula}, relations: ["propuestas"]});

        if (!profesor && !profesor1)
          throw new BusinessLogicException("The profesor with the given id or cedula was not found", BusinessError.NOT_FOUND);
        else if (!profesor)
            if(profesor1.propuestas.length != 0)
                throw new BusinessLogicException("The profesor with the given cedula has propuestas", BusinessError.PRECONDITION_FAILED);
            await this.profesorRepository.remove(profesor1);
        if(profesor.propuestas.length != 0)
            throw new BusinessLogicException("The profesor with the given cedula has propuestas", BusinessError.PRECONDITION_FAILED);
        await this.profesorRepository.remove(profesor);
    }
}
