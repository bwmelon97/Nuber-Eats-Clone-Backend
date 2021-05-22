import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    // uri: 'http://localhost:4000',
    uri: 'https://soogeun.loca.lt/graphql',
    // uri: 'https://1nltu.sse.codesandbox.io/',
    cache: new InMemoryCache(),
    connectToDevTools: true
});