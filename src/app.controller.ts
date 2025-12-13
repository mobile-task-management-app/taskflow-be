import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }
}
