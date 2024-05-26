import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { EstudianteService } from './estudiante.service';

import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estudiantesList = [];
    for(let i = 0; i < 5; i++){
        const estudiante: EstudianteEntity = await repository.save({
        codigoEstudiante: faker.string.numeric({length:10}), 
        nombre: faker.person.fullName(),
        creditosAprovados: faker.number.int(100)})
        estudiantesList.push(estudiante);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findEstudianteById should return a student by id', async () => {
    const storedEstudiante: EstudianteEntity = estudiantesList[0];
    const estudiante: EstudianteEntity = await service.findEstudianteById(storedEstudiante.id);
    expect(estudiante).not.toBeNull();
    expect(estudiante.nombre).toEqual(storedEstudiante.nombre)
    expect(estudiante.codigoEstudiante).toEqual(storedEstudiante.codigoEstudiante)
    expect(estudiante.creditosAprovados).toEqual(storedEstudiante.creditosAprovados)
  });

  it('findEstudianteById should throw an exception for an invalid student', async () => {
    await expect(() => service.findEstudianteById(0)).rejects.toHaveProperty("message", "The student with the given id was not found")
  });

  it('crearEstudiante should return a new student', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      codigoEstudiante: faker.string.numeric({length:10}), 
      nombre: faker.person.fullName(),
      creditosAprovados: faker.number.int(100),
      proyecto: null
    }

    const newEstudiante: EstudianteEntity = await service.crearEstudiante(estudiante);
    expect(newEstudiante).not.toBeNull();

    const storedEstudiante: EstudianteEntity = await repository.findOne({where: {id: newEstudiante.id}})
    expect(newEstudiante.nombre).toEqual(storedEstudiante.nombre)
    expect(newEstudiante.codigoEstudiante).toEqual(storedEstudiante.codigoEstudiante)
    expect(newEstudiante.creditosAprovados).toEqual(storedEstudiante.creditosAprovados)
  });

  it('crearEstudiante should throw an exception for invalid codigoEstudiante', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      codigoEstudiante: faker.string.numeric({length:9}), 
      nombre: faker.person.fullName(),
      creditosAprovados: faker.number.int(100),
      proyecto: null
    }

    await expect(() => service.crearEstudiante(estudiante)).rejects.toHaveProperty("message", "The student's code must have a length of 10")
  });

});