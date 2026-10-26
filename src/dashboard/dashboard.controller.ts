import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('dashboard')
@Auth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  getResumen() {
    return this.dashboardService.getResumen();
  }
}
