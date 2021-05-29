import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { AUTH_TOKEN, GQL_ENDPOINT } from '@constants';

const storagedToken = localStorage.getItem(AUTH_TOKEN)
export const authTokenVar = makeVar(storagedToken)
export const isLoggedInVar = makeVar(Boolean(storagedToken))

export const client = new ApolloClient({
    uri: GQL_ENDPOINT,
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