import { Module } from '@nestjs/common';
import { PodcastsModule } from './podcasts/podcasts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
    }),
    PodcastsModule,
    CommonModule
  ],
})
export class AppModule {}
