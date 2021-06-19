import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RestaurantRepository } from "src/restaurant/repositories/restaurant.repository";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(    
        private readonly restaurants: RestaurantRepository,
        @InjectRepository(Order)
        private readonly orders: Repository<Order>
    ) {}

    async createOrder (
        customer: User, { restaurantId, items }: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId)
            if (!restaurant) throw Error("Restaurant doesn't exist.")

            const order = await this.orders.save(this.orders.create())
            order.restaurant = restaurant;
            order.customer = customer;

            return { ok: true }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

}