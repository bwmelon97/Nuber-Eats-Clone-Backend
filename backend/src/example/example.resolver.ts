import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDTO } from "./dtos/createRestaurant.dto";
import { Restaurant } from "./entities/example.entity";
import { ExampleService } from "./example.service";

@Resolver()
export class ExampleResolver {
    constructor( private readonly exampleService: ExampleService ){}

    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.exampleService.getAll()
    }

    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args('input') createRestaurantDTO: CreateRestaurantDTO
    ): Promise<Boolean> {
        try {
            await this.exampleService.createRestaurant(createRestaurantDTO)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}