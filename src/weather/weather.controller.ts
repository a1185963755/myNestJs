import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async getWeather(@Body() body: { city: string }): Promise<any> {
    const { city } = body;
    return this.weatherService.getWeather(city);
  }
}
