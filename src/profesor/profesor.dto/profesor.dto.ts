import {IsNotEmpty, IsString, IsNumber} from 'class-validator';
export class ProfesorDto {

 @IsNumber()
 @IsNotEmpty()
 readonly cedula: number;

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;

 @IsString()
 @IsNotEmpty()
 readonly grupoDeInvestigacion: string;

 @IsNumber()
 @IsNotEmpty()
 readonly numeroDeExtension: number;
 
}