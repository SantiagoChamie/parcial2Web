import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorService } from './profesor.service';

import { faker } from '@faker-js/faker';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;
  let profesorsList: ProfesorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(getRepositoryToken(ProfesorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    profesorsList = [];
    for(let i = 0; i < 5; i++){
        const profesor: ProfesorEntity = await repository.save({
        cedula: faker.number.int({min:1000000, max:1000000000}), 
        nombre: faker.person.fullName(),
        grupoDeInvestigacion: faker.helpers.arrayElement(['TICSW','IMAGINE', 'COMIT']),
        numeroDeExtension: faker.number.int(100)})
        profesorsList.push(profesor);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findProfesorById should return a professor by id', async () => {
    const storedProfesor: ProfesorEntity = profesorsList[0];
    const profesor: ProfesorEntity = await service.findProfesorById(storedProfesor.id);
    expect(profesor).not.toBeNull();
    expect(profesor.cedula).toEqual(storedProfesor.cedula)
    expect(profesor.grupoDeInvestigacion).toEqual(storedProfesor.grupoDeInvestigacion)
    expect(profesor.numeroDeExtension).toEqual(storedProfesor.numeroDeExtension)
  });

  it('findProfesorById should throw an exception for an invalid professor', async () => {
    await expect(() => service.findProfesorById(0)).rejects.toHaveProperty("message", "The professor with the given id was not found")
  });

  it('crearProfesor should return a new professor', async () => {
    const profesor: ProfesorEntity = {
      id: 0,
      cedula: faker.number.int({min:1000000, max:1000000000}), 
      nombre: faker.person.fullName(),
      grupoDeInvestigacion: faker.helpers.arrayElement(['TICSW','IMAGINE', 'COMIT']),
      numeroDeExtension: faker.number.int(100),
      propuestas: []
    }

    const newProfesor: ProfesorEntity = await service.crearProfesor(profesor);
    expect(newProfesor).not.toBeNull();

    const storedProfesor: ProfesorEntity = await repository.findOne({where: {id: newProfesor.id}})
    expect(profesor.cedula).toEqual(storedProfesor.cedula)
    expect(profesor.grupoDeInvestigacion).toEqual(storedProfesor.grupoDeInvestigacion)
    expect(profesor.numeroDeExtension).toEqual(storedProfesor.numeroDeExtension)
  });

  it('crearProfesor should throw an exception for invalid grupoDeInvestigación', async () => {
    const profesor: ProfesorEntity = {
      id: 0,
      cedula: faker.number.int({min:1000000, max:1000000000}), 
      nombre: faker.person.fullName(),
      grupoDeInvestigacion: "AMISTAD",
      numeroDeExtension: faker.number.int(100),
      propuestas: []
    }

    await expect(() => service.crearProfesor(profesor)).rejects.toHaveProperty("message", "The professor must belong to TICSW, IMAGINE or COMIT")
  });

  it('eliminarProfesor by Id should remove a professor', async () => {
    const profesor: ProfesorEntity = profesorsList[0];
    await service.eliminarProfesor(profesor.id);
  
    const deletedProfesor: ProfesorEntity = await repository.findOne({ where: { id: profesor.id } })
    expect(deletedProfesor).toBeNull();
  });

  it('eliminarProfesor by cedula should remove a professor', async () => {
    const profesor: ProfesorEntity = profesorsList[1];
    await service.eliminarProfesor(profesor.cedula);
  
    const deletedProfesor: ProfesorEntity = await repository.findOne({ where: { id: profesor.id } })
    expect(deletedProfesor).toBeNull();
  });

  it('eliminarProfesor should throw an exception for an invalid id or cedula', async () => {
    await expect(() => service.eliminarProfesor(0)).rejects.toHaveProperty("message", "The professor with the given id or cedula was not found");
  });
});