import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateReviewInput, CreateReviewOutput } from './dtos/create-review.dto';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { PodcastOutput, PodcastsOutput, SearchPodcastsInput } from './dtos/get-podcast.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver(of => Podcast)
export class PodcastsResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Role(['Any'])
    @Query( returns => PodcastsOutput )
    getAllPodcasts(): Promise<PodcastsOutput> { return this.podcastService.getAllPodCasts() }

    @Role(['Any'])
    @Query( returns => PodcastOutput )
    getPodcast( @Args('id') id: number ): Promise<PodcastOutput> {
        return this.podcastService.getPodCastByID(id); 
    }

    @Role(['Host'])
    @Mutation( returns => CoreOutput )
    createPodcast( 
        @Args('input') createPodcastInput: CreatePodcastInput 
    ): Promise<CoreOutput> {
        return this.podcastService.createPodCast(createPodcastInput)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    updatePodcast (
        @Args() updatePodcastDTO: UpdatePodcastDTO
    ): Promise<CoreOutput> {
        return this.podcastService.updatePodCast(updatePodcastDTO)
    }
 
    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    deletePodcast( @Args('id') id: number ): Promise<CoreOutput> { 
        return this.podcastService.deletePodCast(id)
    }

    @Role(['Listener'])
    @Query( returns => PodcastsOutput )
    searchPodcasts( 
        @Args('input') searchPodcastInput: SearchPodcastsInput 
    ): Promise<PodcastsOutput> {
        return this.podcastService.searchPodcasts(searchPodcastInput)
    }

    @Role(['Listener'])
    @Mutation( returns => CreateReviewOutput )
    reviewPodcast (
        @AuthUser() authuser: User,
        @Args('input') createReviewInput: CreateReviewInput
    ) {
        return this.podcastService.createPodcastReview(authuser, createReviewInput)
    }

    // subscribeToPodcast

    // seeSubscriptions

    // markEpisodeAsPlayed
}

@Resolver(of => Episode)
export class EpisodeResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Role(['Any'])
    @Query ( returns => EpisodesOutput )
    getEpisodes ( @Args('id') id: number ): Promise<EpisodesOutput> {
        return this.podcastService.getEpisodes(id) 
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    createEpisode ( 
        @Args() createEpisodeDTO: CreateEpisodeDTO
    ): Promise<CoreOutput> {
        return this.podcastService.createEpisode(createEpisodeDTO)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    updateEpisode ( 
        @Args() updateEpisodeDTO: UpdateEpisodeDTO 
    ): Promise<CoreOutput> {
        return this.podcastService.updateEpisode(updateEpisodeDTO)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    deleteEpisode(
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
    ): Promise<CoreOutput> {
        return this.podcastService.deleteEpisode(pcID, epID)
    }
}