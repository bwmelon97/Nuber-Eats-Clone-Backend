import { CoreOutput } from "src/common/dtos/core-output.dto";
import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { GetRestaurantsOutput } from "../dtos/get-restaurants.dto";
import { Restaurant } from "../entities/restaurant.entity";

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {

    async findAndCheckOwner ( restaurantId: number, userId: number ): Promise<CoreOutput> {
        try {
            /* Restaurant가 없으면 Fail */
            const restaurant = await this.findOne( restaurantId )
            if (!restaurant) throw Error("Restaurant doesn't exist.")
    
            /* 로그인된 유저의 id와 restaurant owner의 id가 다르면 Fail */
            if (userId !== restaurant.ownerId)
                throw Error("You couldn't update restaurant not yours.")

            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to check owner."
            }
        }
    }

    async getWithOffsetPagination ( 
        page: number, 
        ITEMS_PER_PAGE: number, 
        findOptions?: FindManyOptions<Restaurant> 
    ): Promise<GetRestaurantsOutput> {
        try {
            const [restaurants, totalCounts] = await this.findAndCount({
                ...findOptions,
                take: ITEMS_PER_PAGE,
                skip: (page - 1) * ITEMS_PER_PAGE
            })
            const totalPages = Math.ceil(totalCounts / ITEMS_PER_PAGE)
            if ( totalCounts !== 0 && page > totalPages ) 
                throw Error("Page input is bigger than total pages.")
            return { ok: true, restaurants, totalCounts, totalPages }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

}