
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//para nomas usar el decorador @GetUser, para no estar llamando const user = req.user;
//en cada peticion futura

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
