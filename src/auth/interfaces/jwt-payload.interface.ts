

//para tener un tipado seguro
export interface JwtPayload {
  sub: number;       
  email: string;
  rol: string;      
  tiendaId?: number; 
}
