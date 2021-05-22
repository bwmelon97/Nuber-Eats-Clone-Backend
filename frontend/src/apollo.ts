import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar(false)

export const client = new ApolloClient({
    uri: 'https://soogeun.loca.lt/graphql',
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