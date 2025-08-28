// users/decorators/get-user-optional.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


//Este decorador sirve basicamente para que en el formulario de registro de tienda del front
//si el usuario esta logueado es un cliente, entonces agarra los datos del req y actualiza los datos del cliente
//actualizandolo a VENDEDOR, añadiendo otros datos como username y creando la tienda.

export const GetUserOptional = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return null;

    try {
      // Decodifica el JWT sin verificar la firma 
      const decoded: any = jwt.decode(token);
      return decoded?.sub ? { sub: decoded.sub, email: decoded.email, rol: decoded.rol } : null;
    } catch (err) {
      return null;
    }
  },
);
