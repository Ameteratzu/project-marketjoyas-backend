import { ApiPropertyOptional } from "@nestjs/swagger"; 
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"; 
export class RegistrarCalificacion { 
    
    @ApiPropertyOptional({ example: 1, description: 'ID del producto relacionado', minimum: 1 }) 
    @IsNotEmpty() 
    @Min(1) 
    @IsNumber() 
    productoId: number; 
    
    @ApiPropertyOptional({ example: 1, description: 'Calificacion de estrellas 1 - 5', minimum: 1 }) 
    @IsNotEmpty() 
    @Min(1) 
    @Max(5) 
    @IsNumber() 
    estrellas: number; 
    
    @ApiPropertyOptional({ example: 'Muy buen producto', description: 'Comentario opcional del usuario' }) 
    @IsOptional() 
    @IsString() 
    comentario?: string; 

}