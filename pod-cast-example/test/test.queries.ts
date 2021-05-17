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