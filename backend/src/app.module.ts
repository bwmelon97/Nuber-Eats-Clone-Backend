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
import { Dish } from './restaurant/entities/dish.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { MailModule } from './mail/mail.module';
import { OrderItem } from './order/entities/order-item.entity';
import { CommonModule } from './common/common.module';

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
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIL: Joi.string().required(),
      }) 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
      entities: [
        User, Verification, Restaurant, Category, Dish, Order, OrderItem
      ],
      synchronize: true,
      logging: process.env.NODE_ENV === 'dev'
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        if (req) {
          return { user: req['user'] }
        } else {
          console.log(connection)
        }
      }
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIL,
    }),
    AuthModule,
    UserModule,
    RestaurantModule,
    OrderModule,
    CommonModule,
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
