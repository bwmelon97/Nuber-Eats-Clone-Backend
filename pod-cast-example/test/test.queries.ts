import { CreateEpisodeInput } from "src/podcasts/dtos/create-episode.dto"
import { CreatePodcastInput } from "src/podcasts/dtos/create-podcast.dto"
import { UpdateEpisodeInput } from "src/podcasts/dtos/update-episode.dto"
import { UpdatePodcastInput } from "src/podcasts/dtos/update-podcast.dto"

export const getAllPodcastsQuery = `
{
    getAllPodcasts {
        ok
        error
        podcasts {
            id
            title
            category
            rating
            episodes {
                id
                title
                category
                rating
            }
        }
    }
}
`

export const getPodcastQuery = (id: number) => `
{
    getPodcast(id: ${id}) {
        ok
        error
        podcast {
            id
            title
            category
            rating
            episodes {
                id
                title
                category
                rating
            }
        }
    }
}
`

export const createPodcastMutation = ({title, category}: CreatePodcastInput) => `
mutation {
    createPodcast(input: {
        title: "${title}"
        category: "${category}"
    }) {
        ok
        error
    }
}
`

export const updatePodcastMutation = (id: number, { title, category }: UpdatePodcastInput) => `
mutation {
    updatePodcast(id: ${id}, data: {
        ${title ? `title: "${title}"` : ''}
        ${category ? `category: "${category}"` : ''}
    }) {
        ok
        error
    }
}
`

export const deletePodcastMutation = (id: number) => `
mutation {
    deletePodcast(id: ${id}) {
        ok
        error
    }
}
`

export const createEpisodeMutation = (pcID: number, { title, category }: CreateEpisodeInput) => `
mutation {
    createEpisode(pcID: ${pcID}, data: {
        title: "${title}",
        category: "${category}"
    }) {
        ok
        error
    }
}`

export const getEpisodesQuery = (pcID: number) => `
query {
    getEpisodes(id: ${pcID}) {
        ok
        error
        episodes {
            id
            title
            category
            rating
        }
    }
}
`

export const updateEpisodeMutation = (
    pcID: number,
    epID: number,
    {title, category}: UpdateEpisodeInput
) => `
    mutation {
        updateEpisode (pcID: ${pcID}, epID: ${epID}, data: {
            ${title ? `title: "${title}"` : ''}
            ${category ? `category: "${category}"` : ''}
        }) {
            ok
            error
        }
    }
`

export const deleteEpisodeMutation = (pcID: number, epID: number) => `
mutation {
    deleteEpisode(pcID: ${pcID}, epID: ${epID}) {
        ok
        error
    }
}
`