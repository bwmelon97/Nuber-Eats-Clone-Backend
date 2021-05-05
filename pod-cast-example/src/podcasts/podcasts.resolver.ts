import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePodcastDTO } from './dtos/createPodcastDTO';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver()
export class PodcastsResolver {

    private readonly podcastService = new PodcastsService()

    @Query( returns => [Podcast] )
    podcasts() { return this.podcastService.getAllPodCasts() }

    @Query( returns => Podcast )
    podcastByID( @Args('id') id: number ) {
        return this.podcastService.getOnePodCastByID(id)
    }

    @Mutation( returns => Boolean )
    createPodcast( 
        @Args('createPodcastDTO') createPodcastDto: CreatePodcastDTO 
    ) {
        return this.podcastService.createPodCast(createPodcastDto)
    }

    
}
