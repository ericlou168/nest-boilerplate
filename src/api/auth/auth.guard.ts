import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from 'src/common/exceptions/forbidden.exception';

import { UserService } from '@api/user/user.service';

import { JWTPayload } from './auth.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly service: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const authToken = req.get('authorization') || '';
    const [scheme, token] = authToken.split(' ');

    const user = await this.checkUserScheme(scheme, token, permissions);

    (req as any).authUser = user;

    return true;
  }
  async checkUserScheme(scheme: string, token: string, permissions: string[]) {
    if (scheme.toLowerCase() !== 'bearer') throw new UnauthorizedException('Invalid Authorization Scheme');
    if (!token) throw new UnauthorizedException('Authorization token is missing');

    let decoded: JWTPayload;
    try {
      decoded = await this.service.verifyAsync<JWTPayload>(token);
    } catch (e) {
      if (e.name === 'JsonWebTokenError') throw new UnauthorizedException({ statusCode: 4400, message: e.name });
      else if (e.name === 'TokenExpiredError') throw new UnauthorizedException({ statusCode: 4410, message: e.name });
      else throw new UnauthorizedException({ statusCode: 4401, message: e.name });
    }

    const userData = await this.userService.getAccountPermission(decoded.id)
    if (!userData || (userData && !userData.permissions)) throw new ForbiddenException();
    userData.permissions = userData.permissions.split(',');
    if (permissions.length > 0 && !permissions.some(r => userData.permissions.indexOf(r) >= 0))
      throw new ForbiddenException();
    return userData;
  }
}
