import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProfesorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupoDeInvestigacon: string;

    @Column()
    numeroDeExtension: number;
}