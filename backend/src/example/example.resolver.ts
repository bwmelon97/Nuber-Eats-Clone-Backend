import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDTO } from "./dtos/createRestaurant.dto";
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

    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() createRestaurantInput: CreateRestaurantDTO
    ): Boolean {
        /* Some Business Logics */
        return true
    }
}