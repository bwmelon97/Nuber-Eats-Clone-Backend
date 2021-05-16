import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Resolver()
export class RestaurantResolver {
    constructor( private readonly restaurantService: RestaurantService ) {}

    @Role(['Owner'])
    @Mutation(returns => CoreOutput)
    createRestaurant ( 
        @AuthUser() authUser,
        @Args('input') createRestaurantInput: CreateRestaurantInput 
    ): Promise<CoreOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }
}
