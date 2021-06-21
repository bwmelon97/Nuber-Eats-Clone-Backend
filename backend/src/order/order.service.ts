import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dish } from "src/restaurant/entities/dish.entity";
import { RestaurantRepository } from "src/restaurant/repositories/restaurant.repository";
import { User, UserRole } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { GetMyOrdersInput, GetMyOrdersOutput } from "./dtos/get-myorders.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(    
        private readonly restaurants: RestaurantRepository,
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        @InjectRepository(OrderItem)
        private readonly orderItems: Repository<OrderItem>,
    ) {}

    ORDERS_PER_PAGE = 5;

    async getMyOrders (
        user: User, { page, status }: GetMyOrdersInput
    ): Promise<GetMyOrdersOutput> {
        let findKey: string;
        switch(user.role) {
            case UserRole.Client:
                findKey = 'customer'; break;
            case UserRole.Delivery:
                findKey = 'driver'; break;
            case UserRole.Owner:
                break;
        }
        try {
            const [orders, totalCounts] = await this.orders.findAndCount({ 
                where: {
                    [findKey]: user,
                    ...(status && { status })
                },
                take: this.ORDERS_PER_PAGE,
                skip: (page - 1) * this.ORDERS_PER_PAGE
            })
            const totalPages = Math.ceil(totalCounts / this.ORDERS_PER_PAGE)
            
            return { ok: true, orders: orders, totalCounts, totalPages }
        } catch (error) {
            return { ok: false, error: error.meesage }
        }
    }

    async getMyOrdersForClientAndDelivery (
        user: User, getmyOrdersInput: GetMyOrdersInput
    ): Promise<GetMyOrdersOutput> {
        try {
            const { 
                ok, error, orders, totalCounts, totalPages 
            } = await this.getMyOrders(user, getmyOrdersInput)
            if (!ok) throw Error(error)

            return { ok: true, orders: orders, totalCounts, totalPages }
        } catch (error) {
            return { ok: false, error: error.meesage }
        }
    }

    /* Pagination 구현 X, 클린 코드 X */
    async getMyOrdersForOwner (
        owner: User, { page, status }: GetMyOrdersInput
    ): Promise<GetMyOrdersOutput> {
        try {
            const restaurants = await this.restaurants.find({ 
                where: { owner },  
                relations: ['orders']
            })
            let orders = restaurants.map( r => r.orders ).flat(1)
            if (status) {
                orders = orders.filter( o => o.status === status)
            }
            return { ok: true, orders }
        } catch (error) {
            return { ok: false, error: error.meesage }
        }
    }

    async createOrder (
        customer: User, { restaurantId, itemInputs }: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId)
            if (!restaurant) throw Error("Restaurant doesn't exist.")

            const order = this.orders.create()
            order.restaurant = restaurant;
            order.customer = customer;
            const items: OrderItem[] = [];
            let totalCost: number = 0;

            for ( const itemInput of itemInputs ) {
                const { dishId, itemOptions } = itemInput;
                const dish = await this.dishes.findOne( dishId )
                if (!dish) throw Error("Couldn't find a dish.")
                
                const item = this.orderItems.create({chosenOptions: []})
                item.dish = dish;
                let finalItemPrice = dish.price;

                /* Option Input이 올바르지 않은 경우 Error Handling이 필요 */
                /* Item Input에 item Options가 있다면, */
                if (itemOptions) {
                    for ( const itemOption of itemOptions ) {
                        /* ItemOption의 name이 dish Options 중에 있는지 확인 */
                        const dishOption = dish.options.find( dOption => dOption.name === itemOption.name )
                        if (!dishOption) continue;
                        
                        /* 있다면 item의 chosenOption에 input한 option을 추가 */
                        item.chosenOptions.push(itemOption)

                        /* 해당 option에 extra가 있으면 최종 item 가격에 더함 */
                        if (dishOption.extra) 
                            finalItemPrice += dishOption.extra;
                        
                        /* 해당 option에 choice 선택지가 있고, input에도 choiceName이 있다면 */
                        if (dishOption.choices && itemOption.choiceName ) {
                            /* Dish의 choices 중에 input한 이름이 있는지 확인 */
                            const choice = dishOption.choices.find(c => c.name === itemOption.choiceName)
                            if (!choice) continue;

                            /* choice에 extra가 있으면 ItemPrice에 추가 */
                            if (choice.extra)
                                finalItemPrice += choice.extra;
                        }
                    }
                }

                item.ItemPrice = finalItemPrice;
                totalCost += finalItemPrice;
                items.push(item)
            }

            order.items = items;
            order.total = totalCost;
            await this.orders.save(order)

            return { ok: true }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

}