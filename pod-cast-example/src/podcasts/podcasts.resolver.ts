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
    async podcasts(): Promise<Podcast[]> { return this.podcastService.getAllPodCasts() }

    @Query( returns => Podcast )
    async podcastByID( @Args('id') id: number ): Promise<Podcast> {
        return this.podcastService.getOnePodCastByID(id)
    }

    @Mutation( returns => CoreOutput )
    async createPodcast( 
        @Args('input') createPodcastInput: CreatePodcastInput 
    ): Promise<CoreOutput> {
        try {
            await this.podcastService.createPodCast(createPodcastInput)
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }

    @Mutation ( returns => CoreOutput )
    async updatePodcast (
        @Args() updatePodcastDTO: UpdatePodcastDTO
    ): Promise<CoreOutput> {
        try {
            await this.podcastService.updatePodCast(updatePodcastDTO)
            return { ok: true }       
        } catch (error) { return { ok: false, error } }
    }
 
    @Mutation ( returns => CoreOutput )
    async deletePodcast( @Args('id') id: number ): Promise<CoreOutput> { 
        try {
            await this.podcastService.deletePodCast(id)
            return { ok: true }
        } catch (error) { return { ok:false, error } }
    }
}

@Resolver(of => Episode)
export class EpisodeResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Query ( returns => [Episode] )
    episodesOfPodcast ( @Args('id') id: number ) {
        // return this.podcastService.getEpisodes(id)
        return 'hi'
    }

    // @Mutation ( returns => CoreOutput )
    // createEpisode ( 
    //     @Args() createEpisodeDTO: CreateEpisodeDTO
    // ) {
    //     return this.podcastService.createEpisode(createEpisodeDTO)
    // }

    // @Mutation ( returns => CoreOutput )
    // updateEpisode (
    //     @Args() updateEpisodeDTO
    // ) {
    //     return this.podcastService.updateEpisode(updateEpisodeDTO)
    // }

    // @Mutation ( returns => CoreOutput )
    // deleteEpisode(
    //     @Args('pcID') pcID: number,
    //     @Args('epID') epID: number,
    // ) {
    //     return this.podcastService.deleteEpisode(pcID, epID)
    // }
}