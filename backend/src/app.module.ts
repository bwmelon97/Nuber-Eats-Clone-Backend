import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import * as Joi from "joi";
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { User } from './user/entities/user.entity';
import { Verification } from './user/entities/verification.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { Category } from './restaurant/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }) 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
      entities: [User, Verification, Restaurant, Category],
      synchronize: true,
      logging: process.env.NODE_ENV === 'dev'
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] })
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY
    }),
    AuthModule,
    UserModule,
    RestaurantModule,
  ],
})
export class AppModule implements NestModule {
  configure( consumer: MiddlewareConsumer ) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: "/graphql",           // Middleware가 실행되는 path
      method: RequestMethod.ALL,  // Middleware를 실행시킬 req method (GET, POST...)   
    })
  }
}
