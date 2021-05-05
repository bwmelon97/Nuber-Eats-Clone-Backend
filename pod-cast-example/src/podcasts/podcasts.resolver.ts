import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateEpisodeDTO } from './dtos/createEpisodeDTO';
import { CreatePodcastDTO } from './dtos/createPodcastDTO';
import { UpdateEpisodeDTO } from './dtos/updateEpisodeDTO';
import { UpdatePodcastDTO } from './dtos/updatePodcastDTO';
import { Episode } from './entities/episode.entity';
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

    @Query ( returns => [Episode] )
    getEpisodesOfPodcast ( @Args('id') id: number ) {
        return this.podcastService.getEpisodes(id)
    }

    @Mutation ( returns => Boolean )
    createEpisode ( 
        @Args('id') id: number ,
        @Args('createEpisodeDTO') createEpisodeDTO: CreateEpisodeDTO    
    ) {
        return this.podcastService.createEpisode(id, createEpisodeDTO)
    }

    @Mutation ( returns => Boolean )
    updateEpisode (
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
        @Args('updateEpisodeDTO') updateEpisodeDTO: UpdateEpisodeDTO
    ) {
        return this.podcastService.updateEpisode(pcID, epID, updateEpisodeDTO)
    }

    @Mutation ( returns => Boolean )
    deleteEpisode(
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
    ) {
        return this.podcastService.deleteEpisode(pcID, epID)
    }
}
