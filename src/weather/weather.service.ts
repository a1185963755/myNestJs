import { HttpService } from '@nestjs/axios';
import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly weather_api_key: string = '';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.weather_api_key = this.configService.get('WEATHER_API_KEY') || '';
  }
  async getWeather(city: string) {
    const cityCode = await this.getCityCode(city);
    const weatherJson = await firstValueFrom(
      this.httpService.get(
        `https://devapi.qweather.com/v7/weather/now?location=${cityCode}&key=${this.weather_api_key}`,
      ),
    );
    if (!weatherJson.data) {
      throw new HttpException(
        {
          errCode: 400,
          errMsg: `未查询到 ${city} 天气数据`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return weatherJson.data;
  }

  async getCityCode(city: string) {
    const cityCodeJson = await firstValueFrom(
      this.httpService.get(
        `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${this.weather_api_key}`,
      ),
    );
    const cityCODE = cityCodeJson?.data?.location?.[0]?.id;
    console.log('🚀 ~ WeatherService ~ getCityCode ~ cityCODE:', cityCODE);
    if (!cityCODE) {
      throw new HttpException(
        {
          errCode: 400,
          errMsg: `未查询到城市 ${city} 数据`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return cityCODE;
  }
}
