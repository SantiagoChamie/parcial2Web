import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PropuestaService {
    constructor(
        @InjectRepository(PropuestaEntity)
        private readonly propuestaRepository: Repository<PropuestaEntity>
    ){}
    async findAllPropuesta(): Promise<PropuestaEntity[]> {
        return await this.propuestaRepository.find({ relations: ["proyecto", "profesor"] });
    }
    async findPropuestaById(id: number): Promise<PropuestaEntity> {
        const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({where: {id}, relations: ["proyecto"] } );
        if (!propuesta)
          throw new BusinessLogicException("The proposal with the given id was not found", BusinessError.NOT_FOUND);
   
        return propuesta;
    }
    async crearPropuesta(propuesta: PropuestaEntity): Promise<PropuestaEntity> {
        if (propuesta.titulo.length==0)
            throw new BusinessLogicException("The proposal's title must not be empty", BusinessError.NOT_FOUND);
        return await this.propuestaRepository.save(propuesta);
    }
    async deletePropuesta(id: number) {
        const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({where:{id}, relations: ["proyecto"]});
        if (!propuesta)
          throw new BusinessLogicException("The proposal with the given id was not found", BusinessError.NOT_FOUND);
        if (propuesta.proyecto != null)
            throw new BusinessLogicException("The proposal cannot be deleted if it has an active project", BusinessError.PRECONDITION_FAILED);
        await this.propuestaRepository.remove(propuesta);
    }
}
