import { User, UserRole } from "src/user/entities/user.entity";
import { EntityRepository, FindOneOptions, Repository } from "typeorm";
import { GetOrderOutput } from "../dtos/get-order.dto";
import { Order } from "../entities/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    async getAndCheckValidUser (orderId: number, user: User, findOptions?: FindOneOptions): Promise<GetOrderOutput> {
        try {
            const order = await this.findOne(orderId, findOptions)
            if (!order) throw Error("Couldn't find a order")

            let id: number;
            switch(user.role) {
                case UserRole.Client:
                    id = order.customerId; break;
                case UserRole.Delivery:
                    id = order.driverId; break;
                case UserRole.Owner:
                    id = order.restaurant.ownerId; break;
            }

            if ( id !== user.id) 
                throw Error("You don't have permission to see this order.")

            return { ok: true, order }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

}