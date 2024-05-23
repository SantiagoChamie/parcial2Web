import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EstudianteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigoEstudiante: string;

    @Column()
    nombre: string;

    @Column()
    creditosAprovados: number;

}