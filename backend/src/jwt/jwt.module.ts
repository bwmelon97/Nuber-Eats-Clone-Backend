import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
    static forRoot(options: JwtOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [
                JwtService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                }
            ],
            exports: [JwtService, CONFIG_OPTIONS],
        }
    }
}
