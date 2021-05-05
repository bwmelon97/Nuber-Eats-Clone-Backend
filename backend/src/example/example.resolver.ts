import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDTO } from "./dtos/createRestaurant.dto";
import { Example, Restaurant } from "./entities/example.entity";
import { ExampleService } from "./example.service";

@Resolver()
export class ExampleResolver {
    constructor( private readonly exampleService: ExampleService ){}

    @Query(returns => Example)
    example(): Example {
        return { name: 'hi' }
    }

    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.exampleService.getAll()
    }

    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() createRestaurantInput: CreateRestaurantDTO
    ): Boolean {
        /* Some Business Logics */
        return true
    }
}