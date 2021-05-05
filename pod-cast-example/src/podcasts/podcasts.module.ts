import { Module } from '@nestjs/common';
import { PodcastsResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  providers: [PodcastsResolver, PodcastsService],
})
export class PodcastsModule {}
