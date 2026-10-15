import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;       // user id
  id?: string;       // alias
  sid: string;       // session id
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | 'id' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) return undefined;
    if (data === 'id') return user.id ?? user.sub;
    return data ? user[data] : user;
  },
);
