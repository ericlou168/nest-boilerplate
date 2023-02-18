import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { E } from '@common';
import { UserRepository } from '@repositories';

import { JWTPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ select: ['password', 'phone', 'status', 'id'], where: { phone } });
    if (!user) throw new BadRequestException('Account not exist');
    if (user.status !== E.StatusEnum.active)
      throw new BadRequestException('Account not exist');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {

      const { password, status, phone, ...result } = user;
      return result;
    }
    throw new ForbiddenException('Wrong credential');
  }

  async login(email: string, pass: string) {
    const { id } = await this.validateUser(email, pass);
    return {
      account_id: id,
      access_token: this.jwtService.sign({ id }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
      refresh_token: await this.getRefreshToken({ id })
    };
  }

  async getRefreshToken(payload: any): Promise<any> {
    const options = {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES || '30d'
    };
    return this.jwtService.sign(payload, options);
  }

  async regenerateTokens(refresh: string): Promise<any> {
    const options = { secret: process.env.JWT_REFRESH_SECRET };

    try {
      if (await this.jwtService.verify(refresh, options)) {
        // if the refreshToken is valid,
        const { id, type } = this.jwtService.decode(refresh) as JWTPayload;
        const newUnsignedPayload = { id, type };
        return {
          account_id: id,
          access_token: this.jwtService.sign(newUnsignedPayload, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken(newUnsignedPayload)
        };
      }
    } catch (e) {
      throw new UnauthorizedException(e.name);
    }
  }
}
