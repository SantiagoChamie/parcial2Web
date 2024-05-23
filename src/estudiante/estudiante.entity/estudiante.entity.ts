import { Column, Entity, OneToOne, PrimaryGeneratedColumn , JoinColumn} from "typeorm";
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';


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

    @OneToOne(() => ProyectoEntity, proyecto => proyecto.propuesta)
    @JoinColumn()
    proyecto: ProyectoEntity;
}