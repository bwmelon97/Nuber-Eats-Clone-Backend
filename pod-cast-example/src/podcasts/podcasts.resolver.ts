import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { PodcastOutput, PodcastsOutput } from './dtos/get-podcast.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver(of => Podcast)
export class PodcastsResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Query( returns => PodcastsOutput )
    podcasts(): Promise<PodcastsOutput> { return this.podcastService.getAllPodCasts() }

    @Query( returns => PodcastOutput )
    podcastByID( @Args('id') id: number ): Promise<PodcastOutput> {
        return this.podcastService.getPodCastByID(id); 
    }

    @Mutation( returns => CoreOutput )
    createPodcast( 
        @Args('input') createPodcastInput: CreatePodcastInput 
    ): Promise<CoreOutput> {
        return this.podcastService.createPodCast(createPodcastInput)
    }

    @Mutation ( returns => CoreOutput )
    async updatePodcast (
        @Args() updatePodcastDTO: UpdatePodcastDTO
    ): Promise<CoreOutput> {
        try { return this.podcastService.updatePodCast(updatePodcastDTO) } 
        catch (error) { return { ok: false, error } }
    }
 
    @Mutation ( returns => CoreOutput )
    async deletePodcast( @Args('id') id: number ): Promise<CoreOutput> { 
        try { return this.podcastService.deletePodCast(id) } 
        catch (error) { return { ok: false, error } }
    }
}

@Resolver(of => Episode)
export class EpisodeResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Query ( returns => EpisodesOutput )
    async episodesOfPodcast ( @Args('id') id: number ): Promise<EpisodesOutput> {
        try { return this.podcastService.getEpisodes(id) }
        catch (error) { return { ok: false, error } }
    }

    @Mutation ( returns => CoreOutput )
    async createEpisode ( 
        @Args() createEpisodeDTO: CreateEpisodeDTO
    ): Promise<CoreOutput> {
        try { return this.podcastService.createEpisode(createEpisodeDTO) } 
        catch (error) { return { ok: false, error } }
    }

    @Mutation ( returns => CoreOutput )
    async updateEpisode ( 
        @Args() updateEpisodeDTO: UpdateEpisodeDTO 
    ): Promise<CoreOutput> {
        try { return this.podcastService.updateEpisode(updateEpisodeDTO) } 
        catch (error) { return { ok: false, error } }
    }

    @Mutation ( returns => CoreOutput )
    async deleteEpisode(
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
    ): Promise<CoreOutput> {
        try { return this.podcastService.deleteEpisode(pcID, epID) } 
        catch (error) { return { ok: false, error } }
    }
}