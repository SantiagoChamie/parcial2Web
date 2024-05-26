import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoService } from './proyecto.service';

import { faker } from '@faker-js/faker';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;
  let proyectosList: ProyectoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    proyectosList = [];
    for(let i = 0; i < 5; i++){
        const proyecto: ProyectoEntity = await repository.save({
          fechaInicio: faker.date.past(), 
          fechaFin: faker.date.future(),
          URL: faker.internet.url()})
        proyectosList.push(proyecto);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearProyecto should return a new proyecto', async () => {
    const proyecto: ProyectoEntity = {
      id: 0,
      fechaInicio: faker.date.past(), 
      fechaFin: faker.date.future(),
      URL: faker.internet.url(),
      estudiante: null, 
      propuesta: null
    }

    const newProyecto: ProyectoEntity = await service.crearProyecto(proyecto);
    expect(newProyecto).not.toBeNull();

    const storedProyecto: ProyectoEntity = await repository.findOne({where: {id: newProyecto.id}})
    expect(storedProyecto).not.toBeNull();
    expect(storedProyecto.fechaInicio).toEqual(newProyecto.fechaInicio)
    expect(storedProyecto.fechaFin).toEqual(newProyecto.fechaFin)
    expect(storedProyecto.URL).toEqual(newProyecto.URL)
  });

  it('crearProyecto should throw an exception for invalid dates', async () => {
    const proyecto: ProyectoEntity = {
      id: 0,
      fechaInicio: faker.date.future(), 
      fechaFin: faker.date.past(),
      URL: faker.internet.url(),
      estudiante: null, 
      propuesta: null
    }

    await expect(() => service.crearProyecto(proyecto)).rejects.toHaveProperty("message", "The proyecto's starting date cannot happen later than it's ending date")
  });
});