import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi";
import { PodcastsModule } from './podcasts/podcasts.module';
import { Podcast } from './podcasts/entities/podcast.entity';
import { Episode } from './podcasts/entities/episode.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PRIVATE_KEY: Joi.string().required()
      })
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({req}) => ({user: req['user']})
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Podcast, Episode, User],
      logging: true,
      synchronize: true,
    }),
    JwtModule.forRoot(),
    PodcastsModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure( consumer: MiddlewareConsumer ) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL
    })
  }
}
