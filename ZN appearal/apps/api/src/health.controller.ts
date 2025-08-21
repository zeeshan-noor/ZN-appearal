import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      message: 'ZN Apparel API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
