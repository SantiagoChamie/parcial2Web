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
        return await this.propuestaRepository.find({ relations: ["creador", "discusion"] });
    }
    async findPropuestaById(id: number): Promise<PropuestaEntity> {
        const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({where: {id}, relations: ["creador", "discusion"] } );
        if (!propuesta)
          throw new BusinessLogicException("The propuesta with the given id was not found", BusinessError.NOT_FOUND);
   
        return propuesta;
    }
    async crearPropuesta(propuesta: PropuestaEntity): Promise<PropuestaEntity> {
        return await this.propuestaRepository.save(propuesta);
    }
    async deletePropuesta(id: number) {
        const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({where:{id}});
        if (!propuesta)
          throw new BusinessLogicException("The propuesta with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.propuestaRepository.remove(propuesta);
    }
}
