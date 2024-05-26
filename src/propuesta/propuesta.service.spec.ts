import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';
import { PropuestaService } from './propuesta.service';

import { faker } from '@faker-js/faker';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';

describe('PropuestaService', () => {
  let service: PropuestaService;
  let repository: Repository<PropuestaEntity>;
  let propuestasList: PropuestaEntity[];
  let proyectoRepository: Repository<ProyectoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PropuestaService],
    }).compile();

    service = module.get<PropuestaService>(PropuestaService);
    repository = module.get<Repository<PropuestaEntity>>(getRepositoryToken(PropuestaEntity));
    proyectoRepository = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    propuestasList = [];
    for (let i = 0; i < 5; i++) {
      const propuesta: PropuestaEntity = await repository.save({
        titulo: faker.company.name(),
        descripcion: faker.lorem.paragraph(),
        palabraClave: faker.company.buzzNoun(),
      });
      propuestasList.push(propuesta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllPropuesta should return all propuestas', async () => {
    const propuestas: PropuestaEntity[] = await service.findAllPropuesta();
    expect(propuestas).not.toBeNull();
    expect(propuestas).toHaveLength(propuestasList.length);
  });

  it('findPropuestaById should return a propuesta by id', async () => {
    const storedPropuesta: PropuestaEntity = propuestasList[0];
    const propuesta: PropuestaEntity = await service.findPropuestaById(storedPropuesta.id);
    expect(propuesta).not.toBeNull();
    expect(propuesta.titulo).toEqual(storedPropuesta.titulo);
    expect(propuesta.descripcion).toEqual(storedPropuesta.descripcion);
    expect(propuesta.palabraClave).toEqual(storedPropuesta.palabraClave);
  });

  it('findPropuestaById should throw an exception for an invalid proposal', async () => {
    await expect(() => service.findPropuestaById(0)).rejects.toHaveProperty("message", "The proposal with the given id was not found");
  });

  it('crearPropuesta should return a new proposal', async () => {
    const propuesta: PropuestaEntity = {
      id: 0,
      titulo: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      palabraClave: faker.company.buzzNoun(),
      profesor: null,
      proyecto: null,
    };

    const newPropuesta: PropuestaEntity = await service.crearPropuesta(propuesta);
    expect(newPropuesta).not.toBeNull();

    const storedPropuesta: PropuestaEntity = await repository.findOne({ where: { id: newPropuesta.id } });
    expect(newPropuesta.titulo).toEqual(storedPropuesta.titulo);
    expect(newPropuesta.descripcion).toEqual(storedPropuesta.descripcion);
    expect(newPropuesta.palabraClave).toEqual(storedPropuesta.palabraClave);
  });

  it('crearPropuesta should throw an exception for an invalid title', async () => {
    const propuesta: PropuestaEntity = {
      id: 1,
      titulo: "",
      descripcion: faker.lorem.paragraph(),
      palabraClave: faker.company.buzzNoun(),
      profesor: null,
      proyecto: null,
    };
    await expect(service.crearPropuesta(propuesta)).rejects.toHaveProperty("message", "The proposal's title must not be empty");
  });

  it('deletePropuesta should remove a proposal', async () => {
    const propuesta: PropuestaEntity = propuestasList[0];
    await service.deletePropuesta(propuesta.id);

    const deletedPropuesta: PropuestaEntity = await repository.findOne({ where: { id: propuesta.id } });
    expect(deletedPropuesta).toBeNull();
  });

  it('deletePropuesta should throw an exception for a proposal with an active project', async () => {
    
    const proyecto = await proyectoRepository.save({
      fechaInicio: faker.date.past(),
      fechaFin: faker.date.future(),
      URL: faker.internet.url(),
      estudiante: null,
      propuesta: null,
    });

    const propuesta: PropuestaEntity = await repository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      palabraClave: faker.company.buzzNoun(),
      proyecto: proyecto
    });

    await expect(service.deletePropuesta(propuesta.id)).rejects.toHaveProperty("message", "The proposal cannot be deleted if it has an active project");
  });
});
