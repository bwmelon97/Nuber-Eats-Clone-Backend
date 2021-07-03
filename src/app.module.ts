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
import { TOKEN_KEY } from './common/common.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').default('dev'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        DATABASE_URL: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIL: Joi.string().required(),
      }) 
    }),
    TypeOrmModule.forRoot({
      ...( process.env.NODE_ENV === 'production' ?
        {
          type: 'postgres',
          url: process.env.DATABASE_URL
        } :
        {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
      ),
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
      context: ({ req, connection }) => ({
        token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
      })
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
export class AppModule {}