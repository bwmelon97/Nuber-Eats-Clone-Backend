import { Module } from '@nestjs/common';
import { PodcastsResolver } from './podcasts.resolver';

@Module({
  providers: [PodcastsResolver]
})
export class PodcastsModule {}
