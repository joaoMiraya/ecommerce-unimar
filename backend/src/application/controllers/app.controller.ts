import { Controller, Get } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
}

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  health(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
