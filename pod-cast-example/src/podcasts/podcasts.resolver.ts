import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver(of => Podcast)
export class PodcastsResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Query( returns => [Podcast] )
    podcasts() { return this.podcastService.getAllPodCasts() }

    @Query( returns => Podcast )
    podcastByID( @Args('id') id: number ) {
        return this.podcastService.getOnePodCastByID(id)
    }

    @Mutation( returns => CoreOutput )
    createPodcast( 
        @Args('input') createPodcastInput: CreatePodcastInput 
    ) {
        return this.podcastService.createPodCast(createPodcastInput)
    }

    @Mutation ( returns => CoreOutput )
    updatePodcast (
        @Args() updatePodcastDTO: UpdatePodcastDTO
    ) {
        return this.podcastService.updatePodCast(updatePodcastDTO)
    }
 
    @Mutation ( returns => CoreOutput )
    deletePodcast( @Args('id') id: number ) { return this.podcastService.deletePodCast(id) }
}

@Resolver(of => Episode)
export class EpisodeResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Query ( returns => [Episode] )
    episodesOfPodcast ( @Args('id') id: number ) {
        return this.podcastService.getEpisodes(id)
    }

    @Mutation ( returns => CoreOutput )
    createEpisode ( 
        @Args() createEpisodeDTO: CreateEpisodeDTO
    ) {
        return this.podcastService.createEpisode(createEpisodeDTO)
    }

    @Mutation ( returns => CoreOutput )
    updateEpisode (
        @Args() updateEpisodeDTO
    ) {
        return this.podcastService.updateEpisode(updateEpisodeDTO)
    }

    @Mutation ( returns => CoreOutput )
    deleteEpisode(
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
    ) {
        return this.podcastService.deleteEpisode(pcID, epID)
    }
}