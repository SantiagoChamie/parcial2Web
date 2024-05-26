import {IsNotEmpty, IsString, IsNumber} from 'class-validator';
export class EstudianteDto {

 @IsString()
 @IsNotEmpty()
 readonly codigoEstudiante: string;

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;

 @IsNumber()
 @IsNotEmpty()
 readonly creditosAprovados: number;
 
}