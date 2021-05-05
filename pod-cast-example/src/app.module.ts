import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsController } from './podcasts/podcasts.controller';
import { PodcastsService } from './podcasts/podcasts.service';
import { PodcastsModule } from './podcasts/podcasts.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
    PodcastsModule
  ],
  controllers: [AppController, PodcastsController],
  providers: [AppService, PodcastsService],
})
export class AppModule {}
