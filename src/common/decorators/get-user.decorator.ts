
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

//para nomas usar el decorador @GetUser, para no estar llamando const user = req.user;
//en cada peticion futura y tener un tipado del payload mas seguro

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload | undefined;
  },
);
