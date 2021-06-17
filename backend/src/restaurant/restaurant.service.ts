import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/user/entities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
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
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Injectable()
export class RestaurantService {
    constructor(
        private readonly restaurants: RestaurantRepository,
        private readonly categories: CategoryRepository,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
    ) {}

    private readonly RESTAURANTS_PER_PAGE = 10;

    async getRestaurantById (
        { restaurantId }: GetRestaurantByIdInput
    ): Promise<GetRestaurantByIdOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId)
            if (!restaurant) throw Error("Couldn't find the restaurant.")
            return { ok: true, restaurant }
        } catch (error) { return { ok: false, error: error.message } }
    }

    async getAllRestaurants ({ page }: GetAllRestaurantsInput): Promise<GetAllRestaurantsOutput> {
        try {
            const [restaurants, totalCounts] = await this.restaurants.findAndCount({
                take: this.RESTAURANTS_PER_PAGE,
                skip: (page - 1) * this.RESTAURANTS_PER_PAGE
            })
            const totalPages = Math.ceil(totalCounts / this.RESTAURANTS_PER_PAGE)
            if (page > totalPages) throw Error("Page input is bigger than total pages.")
            return { ok: true, restaurants, totalCounts, totalPages }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Couldn't find restaurants..."
            }
        }
    }
    
    async searchRestaurantsByName ({ page, query }: SearchRestaurantsInput): Promise<SearchRestaurantsOutput> {
        try {
            const [restaurants, totalCounts] = await this.restaurants.findAndCount({
                // where: { 
                //     name: Raw(name => `${name} LIKE '%${query}%'`) 
                // },
                where: { name: Like(`%${query}%`) },
                take: this.RESTAURANTS_PER_PAGE,
                skip: (page - 1) * this.RESTAURANTS_PER_PAGE
            })
            const totalPages = Math.ceil(totalCounts / this.RESTAURANTS_PER_PAGE)
            if (page > totalPages) throw Error("Page input is bigger than total pages.")
            return { ok: true, restaurants, totalCounts, totalPages }
        } catch (error) { 
            return { ok: false, error: error.message } 
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
            
            const { ok, error } = await this.restaurants.findAndCheckOwner( 
                restaurantId, authUser.id 
            )
            if (!ok) throw Error(error)

            /* 카테고리 input이 있는 경우, category Repo에서 getOrCreate 한다. */
            let category: Category = null;
            if (categoryName)
                category = await this.categories.getOrCreate(categoryName)
                
            await this.restaurants.save({
                id: restaurantId,
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

    async deleteRestaurant (
        authUser: User,
        { restaurantId }: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> { 
        try {
            const { ok, error } = await this.restaurants.findAndCheckOwner( 
                restaurantId, authUser.id 
            )
            if (!ok) throw Error(error)

            await this.restaurants.delete( restaurantId )
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to delete restaurant."
            }
        }
    }
    
    countRestaurantsByCategory(category: Category): Promise<number> {
        return this.restaurants.count({ category })
    }

    async getAllCategories(): Promise<GetAllCategoriesOutput> {
        try {
            const categories = await this.categories.find()
            return { ok: true, categories }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to get categories'
            }
        }
    }

    async getCategoryByName( { nameInput, page }: GetCategoryInput ): Promise<GetCategoryOutput> {
        try {
            const { ok, error, category } = await this.categories.getByName(nameInput);
            if (!ok) throw Error(error)

            const [restaurants, totalCounts] = await this.restaurants.findAndCount({
                where: { category },
                take: this.RESTAURANTS_PER_PAGE,
                skip: (page - 1) * this.RESTAURANTS_PER_PAGE
            })
            const totalPages = Math.ceil(totalCounts / this.RESTAURANTS_PER_PAGE)
            if (page > totalPages)
                throw Error('Page Input is bigger than total pages.')

            return { 
                ok: true, 
                category, 
                restaurants,
                totalCounts,
                totalPages
            }
        } catch (error) { return { ok: false, error: error.message } }
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
