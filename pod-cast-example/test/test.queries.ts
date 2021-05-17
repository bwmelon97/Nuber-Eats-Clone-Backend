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