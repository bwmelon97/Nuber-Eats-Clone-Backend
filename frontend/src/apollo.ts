import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { GQL_ENDPOINT } from '@constants';

export const isLoggedInVar = makeVar(false)

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