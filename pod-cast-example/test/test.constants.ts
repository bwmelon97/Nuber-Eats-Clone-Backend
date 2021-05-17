import { CreateEpisodeInput } from "src/podcasts/dtos/create-episode.dto";
import { CreatePodcastInput } from "src/podcasts/dtos/create-podcast.dto";
import { UpdatePodcastInput } from "src/podcasts/dtos/update-podcast.dto";
import { Episode } from "src/podcasts/entities/episode.entity";
import { Podcast } from "src/podcasts/entities/podcast.entity";

export const GRAPHQL_ENDPOINT = '/graphql'

export const WRONG_ID = 999;

const TEST = 'TEST'
const UPDATE = 'UPDATE'

export const TEST_PODCAST: Omit<Podcast, 'id' | 'createdAt' | 'updatedAt'> = {
    title: TEST,
    category: TEST,
    rating: 0,
    episodes: []
}

export const TEST_CREATE_PODCAST_INPUT: CreatePodcastInput = {
    title: TEST,
    category: TEST
}

export const TEST_UPDATE_PODCAST_INPUT: UpdatePodcastInput = {
    title: UPDATE,
    category: UPDATE
}

export const TEST_EPISODE: Omit<Episode, 'id' | 'createdAt' | 'updatedAt' | 'podcast'> = {
    title: TEST,
    category: TEST,
    rating: 0,
}

export const TEST_CREATE_EPISODE_INPUT: CreateEpisodeInput = {
    title: TEST,
    category: TEST
}