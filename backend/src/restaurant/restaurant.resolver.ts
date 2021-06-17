import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/user/entities/user.entity';
import { GetAllCategoriesOutput } from './dtos/all-categories.dto';
import { CreateDishInput } from './dtos/create-dish.dto';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { DeleteDishInput } from './dtos/delete-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import { GetRestaurantByIdInput, GetRestaurantByIdOutput } from './dtos/get-restaurant.dto';
import { GetAllRestaurantsInput, GetAllRestaurantsOutput } from './dtos/get-restaurants.dto';
import { SearchRestaurantsInput, SearchRestaurantsOutput } from './dtos/search-restaurants.dto';
import { UpdateDishInput } from './dtos/update-dish.dto';
import { UpdateRestaurantInput, UpdateRestaurantOutput } from './dtos/update-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor( private readonly restaurantService: RestaurantService ) {}
    
    @Role(['Any'])
    @Query(returns => GetRestaurantByIdOutput)
    getRestaurantById (
        @Args('input') getRestaurantByIdInput: GetRestaurantByIdInput
    ): Promise<GetRestaurantByIdOutput> {
        return this.restaurantService.getRestaurantById(getRestaurantByIdInput)
    }

    @Role(['Any'])
    @Query(returns => GetAllRestaurantsOutput)
    getAllRestaurants(
        @Args('input') getAllRestaurantsInput: GetAllRestaurantsInput
    ): Promise<GetAllRestaurantsOutput> {
        return this.restaurantService.getAllRestaurants(getAllRestaurantsInput)
    }

    @Role(['Any'])
    @Query(returns => SearchRestaurantsOutput)
    searchRestaurants(
        @Args('input') searchRestaurantsInput: SearchRestaurantsInput
    ): Promise<SearchRestaurantsOutput> {
        return this.restaurantService.searchRestaurantsByName(searchRestaurantsInput)
    }
    
    @Role(['Owner'])
    @Mutation(returns => CoreOutput)
    createRestaurant ( 
        @AuthUser() authUser,
        @Args('input') createRestaurantInput: CreateRestaurantInput 
    ): Promise<CoreOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }

    @Role(['Owner'])
    @Mutation(returns => UpdateRestaurantOutput)
    updateRestaurant (
        @AuthUser() authUser,
        @Args('input') updateRestaurantInput: UpdateRestaurantInput
    ): Promise<UpdateRestaurantOutput> {
        return this.restaurantService.updateRestaurant(authUser, updateRestaurantInput)
    }

    @Role(['Owner'])
    @Mutation(returns => DeleteRestaurantOutput)
    deleteRestaurant (
        @AuthUser() authUser,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(authUser, deleteRestaurantInput)
    }
}

@Resolver(of => Category)
export class CategoryResolver {
    constructor( private readonly service: RestaurantService ) {}

    @ResolveField(type => Int)
    restaurantCounts(@Parent() category: Category): Promise<Number> {
        return this.service.countRestaurantsByCategory(category)
    }

    @Role(['Client', 'Owner'])
    @Query(returns => GetAllCategoriesOutput)
    getAllCategories(): Promise<GetAllCategoriesOutput> {
        return this.service.getAllCategories();
    }

    @Query(returns => GetCategoryOutput)
    getCategoryByName(
        @Args('input') getCategoryInput: GetCategoryInput
    ): Promise<GetCategoryOutput> {
        return this.service.getCategoryByName(getCategoryInput)
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

    @Mutation(returns => CoreOutput)
    updateDish (
        @AuthUser() owner: User,
        @Args('input') updateDishInput: UpdateDishInput
    ): Promise<CoreOutput> {
        return this.restaurantService.updateDish(owner, updateDishInput)
    }

    @Mutation(returns => CoreOutput)
    deleteDish (
        @AuthUser() owner: User,
        @Args('input') deleteDishInput: DeleteDishInput
    ): Promise<CoreOutput> {
        return this.restaurantService.deleteDish(owner, deleteDishInput)
    }
}
