import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthBody, RegenerateRefreshTokenBody } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Account not exist | Body not pass validation' })
  @ApiResponse({ status: 403, description: 'Account not yet verify | Wrong credential' })
  async authenticateAdmin(@Body() body: AuthBody) {
    const tokenSet = await this.authService.login(body.phone, body.password);
    return { data: tokenSet };
  }

  @Post('refresh')
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Status code expiredToken: 4410,unauthorized: 4401,invalidToken: 4400' })
  async regenerateRefreshToken(@Body() body: RegenerateRefreshTokenBody) {
    const newTokenSet = await this.authService.regenerateTokens(body.refreshToken);
    return { data: newTokenSet };
  }
}
