import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';
import { JWT_OPTIONS } from './jwt.constants'

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [ JwtService ],
      providers: [ JwtService,
        { provide: JWT_OPTIONS, useValue: options }
      ]
    }
  }
}
