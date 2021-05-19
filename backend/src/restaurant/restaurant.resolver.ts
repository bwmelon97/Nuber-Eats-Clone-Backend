import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateDishInput } from './dtos/create-dish.dto';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { GetAllRestaurantsOutput } from './dtos/get-restaurant.dto';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor( private readonly restaurantService: RestaurantService ) {}
    
    @Role(['Any'])
    @Query(returns => GetAllRestaurantsOutput)
    getAllRestaurants(): Promise<GetAllRestaurantsOutput> {
        return this.restaurantService.getAllRestaurants()
    }
    
    @Role(['Owner'])
    @Mutation(returns => CoreOutput)
    createRestaurant ( 
        @AuthUser() authUser,
        @Args('input') createRestaurantInput: CreateRestaurantInput 
    ): Promise<CoreOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }
}

@Resolver(of => Dish)
export class DishResolver {
    constructor( private readonly restaurantService: RestaurantService ) {}

    @Mutation(returns => CoreOutput)
    createDish (
        @AuthUser() owner: User,
        @Args('input') createDishInput: CreateDishInput
    ): Promise<CoreOutput> {
        return this.restaurantService.createDish(owner, createDishInput)
    }
}
