import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { Review } from './entities/review.entity';
import { EpisodeResolver, PodcastsResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Podcast, Episode, Review])
  ],
  providers: [PodcastsResolver, PodcastsService, EpisodeResolver],
})
export class PodcastsModule {}
