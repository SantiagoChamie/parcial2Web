import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PropuestaEntity } from '../../propuesta/propuesta.entity/propuesta.entity';


@Entity()
export class ProfesorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupoDeInvestigacion: string;

    @Column()
    numeroDeExtension: number;

    @OneToMany(() => PropuestaEntity, propuesta => propuesta.profesor)
    propuestas: PropuestaEntity[];
}