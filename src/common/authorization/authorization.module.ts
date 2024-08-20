import { DynamicModule, Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { RegisterOptions } from './models/options.model';
import { AUTHORIZATION_ENFORCER } from './constants/token.const';
import { newEnforcer } from 'casbin';

@Module({})
export class AuthorizationModule {
  static register(options: RegisterOptions): DynamicModule {
    const { modelPath, policyAdapter, global = false } = options;
    const providers = [
      {
        provide: AUTHORIZATION_ENFORCER,
        useFactory: async () => {
          const enforcer = await newEnforcer(modelPath, policyAdapter);
          return enforcer;
        },
      },
      AuthorizationService,
    ];
    return {
      global,
      module: AuthorizationModule,
      providers,
      exports: [...providers],
    };
  }
}
