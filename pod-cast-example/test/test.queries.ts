import { CreateEpisodeInput } from "src/podcasts/dtos/create-episode.dto"
import { CreatePodcastInput } from "src/podcasts/dtos/create-podcast.dto"
import { UpdateEpisodeInput } from "src/podcasts/dtos/update-episode.dto"
import { UpdatePodcastInput } from "src/podcasts/dtos/update-podcast.dto"
import { CreateAccountInput } from "src/users/dtos/create-account.dto"
import { EditProfileInput } from "src/users/dtos/edit-profile.dto"
import { LoginInput } from "src/users/dtos/login.dto"

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


/* *************************************************************************** */

export const createAccountMutation = ({ email, password }: Omit<CreateAccountInput, 'role'>) => `
mutation {
    createAccount(input: {
        email: "${email}"
        password: "${password}"
        role: Host
    }) {
        ok
        error
    }
}`

export const loginMutation = ({ email, password }: LoginInput) => `
mutation {
    login(input: {
        email: "${email}"
        password: "${password}"
    }) {
        ok
        error
        token
    }
}
`

export const meQuery = `
query {
    me {
        ok
        error
        user {
            id
            email
            role
      }
    }
}
`

export const seeProfileQuery = (id: number) => `
query {
    seeProfile (id: ${id}) {
        ok
        error
        user {
            id
            email
            role
        }
    }
}`

export const editProfileMutation = ({email, password}: EditProfileInput) => `
mutation {
    editProfile (input: {
        ${email ? `email: "${email}"` : ''}
        ${password ? `password: "${password}"` : ''}
    }) {
        ok
        error
    }
}
`