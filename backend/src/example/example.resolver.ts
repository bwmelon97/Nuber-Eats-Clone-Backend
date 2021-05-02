import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Example, Restaurant } from "./entities/example.entity";

@Resolver()
export class ExampleResolver {
    @Query(returns => Example)
    example(): Example {
        return { name: 'hi' }
    }

    @Query(returns => [Restaurant])
    restaurants(
        @Args('isVegan') isVegan: boolean = false
    ): Restaurant[] {
        return [{name: 'first'}]
    }
}