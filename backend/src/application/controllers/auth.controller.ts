import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor() {}

  @Get('authenticate')
  authenticate(): any {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
