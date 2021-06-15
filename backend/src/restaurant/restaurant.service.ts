import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDishInput } from './dtos/create-dish.dto';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { DeleteDishInput } from './dtos/delete-dish.dto';
import { GetAllRestaurantsOutput } from './dtos/get-restaurant.dto';
import { UpdateDishInput } from './dtos/update-dish.dto';
import { UpdateRestaurantInput, UpdateRestaurantOutput } from './dtos/update-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        
        private readonly categories: CategoryRepository,
        
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
    ) {}

    async getAllRestaurants (): Promise<GetAllRestaurantsOutput> {
        try {
            const restaurants = await this.restaurants.find( { relations: ['menu', 'owner'] } )
            return { ok: true, restaurants }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Couldn't find restaurants..."
            }
        }
    }

    async createRestaurant (
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CoreOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner
            newRestaurant.category = await this.categories.getOrCreate(
                createRestaurantInput.categoryName
            )
            await this.restaurants.save(newRestaurant)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Restaurant"
            }
        }
    }

    async updateRestaurant (
        authUser: User,
        updateRestaurantInput: UpdateRestaurantInput
    ): Promise<UpdateRestaurantOutput> {
        try {
            const { restaurantId, categoryName } = updateRestaurantInput
            
            /* Restaurant가 없으면 Fail */
            const restaurant = await this.restaurants.findOne( restaurantId )
            if (!restaurant) throw Error("Restaurant doesn't exist.")

            /* 로그인된 유저의 id와 restaurant owner의 id가 다르면 Fail */
            if (authUser.id !== restaurant.ownerId)
                throw Error("You couldn't update restaurant not yours.")

            /* 카테고리 input이 있는 경우, category Repo에서 getOrCreate 한다. */
            let category: Category = null;
            if (categoryName)
                category = await this.categories.getOrCreate(categoryName)
                
            await this.restaurants.update(restaurantId, {
                ...updateRestaurantInput,
                ...( category && { category } )
            })

            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to update restaurant."
            }
        }
    }


    async createDish ( 
        owner: User,
        createDishInput: CreateDishInput
    ): Promise<CoreOutput> {
        try {
            /* Restaurant를 못찾으면 Fail */
            const restaurant = await this.restaurants.findOne( createDishInput.restaurantId )
            if (!restaurant) throw Error("Couldn't find the restaurant.")

            /* owner와 Restaurant의 owner가 같지 않으면 Fail */
            if (owner.id !== restaurant.ownerId)
                throw Error('User is not owner of the restaurant.')

            await this.dishes.save( this.dishes.create({ ...createDishInput, restaurant }) )
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Couldn't create a dish."
            }
        }
    }

    async checkDishOwner (dishId: number, owner: User) {
        try {
            /* Dish를 못찾으면 fail 리턴 */
            const dish = await this.dishes.findOne( dishId, { relations: ['restaurant'] } )
            if ( !dish ) throw Error("Couldn't find a dish.")
    
            /* owner와 Dish owner id가 다르면 fail 리턴 */
            if (owner.id !== dish.restaurant.ownerId)
                throw Error("You don't allow edit this dish.")

            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to check dish owner.'
            }
        }
    }

    async updateDish (
        owner: User,
        updateDishInput: UpdateDishInput
    ): Promise<CoreOutput> {
        try {
            const { dishId, data } = updateDishInput
            const { ok, error } = await this.checkDishOwner(dishId, owner);
            if (!ok) throw Error(error)

            await this.dishes.update(dishId, { ...data })
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to update Dish.'
            }
        }
    }

    async deleteDish (
        owner: User,
        { dishId }: DeleteDishInput
    ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.checkDishOwner(dishId, owner);
            if (!ok) throw Error(error)

            await this.dishes.delete(dishId)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to delete Dish.'
            }
        }
    }
}
