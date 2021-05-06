import { Module } from '@nestjs/common';
import { PodcastsModule } from './podcasts/podcasts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { Podcast } from './podcasts/entities/podcast.entity';
import { Episode } from './podcasts/entities/episode.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Podcast, Episode],
      logging: true,
      synchronize: true,
    }),
    PodcastsModule,
    CommonModule
  ],
})
export class AppModule {}
