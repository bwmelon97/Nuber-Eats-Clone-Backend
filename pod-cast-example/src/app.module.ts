import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsController } from './podcasts/podcasts.controller';
import { PodcastsService } from './podcasts/podcasts.service';

@Module({
  imports: [],
  controllers: [AppController, PodcastsController],
  providers: [AppService, PodcastsService],
})
export class AppModule {}
