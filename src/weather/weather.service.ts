import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface QWeatherResponse<T> {
  code: string;
  now?: T;
  fxLink?: string;
  location?: Array<{ id: string }>;
}

@Injectable()
export class WeatherService {
  private readonly weatherApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.weatherApiKey =
      this.configService.get<string>('WEATHER_API_KEY') || '';
  }

  async getWeather(city: string) {
    const cityCode = await this.getCityCode(city);
    const weatherJson = await firstValueFrom(
      this.httpService.get<QWeatherResponse<unknown>>(
        'https://devapi.qweather.com/v7/weather/now',
        { params: { location: cityCode, key: this.weatherApiKey } },
      ),
    );
    const { now, fxLink } = weatherJson.data;
    if (!now) {
      throw new BadRequestException(`未查询到 ${city} 天气数据`);
    }
    return {
      now,
      link: fxLink,
    };
  }

  async getCityCode(city: string) {
    const cityCodeJson = await firstValueFrom(
      this.httpService.get<QWeatherResponse<never>>(
        'https://geoapi.qweather.com/v2/city/lookup',
        { params: { location: city, key: this.weatherApiKey } },
      ),
    );
    const cityCode = cityCodeJson.data.location?.[0]?.id;
    if (!cityCode) {
      throw new BadRequestException(`未查询到城市 ${city} 数据`);
    }
    return cityCode;
  }
}
