import { CreatePodcastInput } from "src/podcasts/dtos/create-podcast.dto"

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