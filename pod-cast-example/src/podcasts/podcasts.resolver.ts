import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePodcastDTO } from './dtos/createPodcastDTO';
import { UpdatePodcastDTO } from './dtos/updatePodcastDTO';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver()
export class PodcastsResolver {

    constructor(private readonly podcastService: PodcastsService) {}

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

    @Mutation ( returns => Boolean )
    updatePodcast (
        @Args('id') id: number,
        @Args('updatePodcastDTO') updatePodcastDTO: UpdatePodcastDTO
    ) {
        return this.podcastService.updatePodCast(id, updatePodcastDTO)
    }
 
    @Mutation ( returns => Boolean )
    deletePodcast( @Args('id') id: number ) { return this.podcastService.deletePodCast(id) }
}
