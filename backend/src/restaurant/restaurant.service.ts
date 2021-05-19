import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDishInput } from './dtos/create-dish.dto';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { GetAllRestaurantsOutput } from './dtos/get-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>,
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

            /* Category가 없는 경우 새로 만들고, 있으면 그대로 사용할 수 있음 */
            const categoryName = createRestaurantInput.categoryName.trim().toLowerCase().replace(/ +/g, ' ')
            let category = await this.categories.findOne({ name: categoryName })

            if (!category) {
                const categorySlug = categoryName.replace(/ /g, '-')
                category = await this.categories.save(this.categories.create({ name: categoryName, slug: categorySlug }))
            }

            newRestaurant.category = category
            await this.restaurants.save(newRestaurant)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Restaurant"
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
            if (owner.id !== restaurant.ownerID)
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
}
