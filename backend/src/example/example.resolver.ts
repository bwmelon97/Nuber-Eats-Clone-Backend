import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class ExampleResolver {
    @Query(returns => Boolean)
    isHello() {
        return true
    }
}