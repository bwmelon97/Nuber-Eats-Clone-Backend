import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AUTH_TOKEN, GQL_ENDPOINT } from '@constants';

const storagedToken = localStorage.getItem(AUTH_TOKEN)
export const authTokenVar = makeVar(storagedToken)
export const isLoggedInVar = makeVar(Boolean(storagedToken))

const httpLink = createHttpLink({
    uri: GQL_ENDPOINT
})

const authLink = setContext( (_, { headers }) => ({
    headers: {
        ...headers,
        "x-jwt": authTokenVar() || ""
    } 
}) )

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        // typePolicies: {
        //     Query: {
        //         fields: {
        //             loggedIn: {
        //                 read: () => isLoggedInVar()
        //             }
        //         }
        //     }
        // }
    }),
    connectToDevTools: true
});