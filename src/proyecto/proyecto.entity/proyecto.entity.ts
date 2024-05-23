import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { PropuestaEntity } from '../../propuesta/propuesta.entity/propuesta.entity';


@Entity()
export class ProyectoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fechaInicio: Date;

    @Column()
    fechaFin: Date;

    @Column()
    URL: string;

    @OneToOne(() => EstudianteEntity, estudiante => estudiante.proyecto)
    estudiante: EstudianteEntity;

    @OneToOne(() => PropuestaEntity, propuesta => propuesta.proyecto)
    propuesta: PropuestaEntity;
}