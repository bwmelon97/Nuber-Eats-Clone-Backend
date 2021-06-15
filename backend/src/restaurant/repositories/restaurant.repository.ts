import { CoreOutput } from "src/common/dtos/core-output.dto";
import { EntityRepository, Repository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {

    async findAndCheckOwner ( restaurantId, userId ): Promise<CoreOutput> {
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

}