import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User, UserRole } from "src/user/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { GetMyOrdersInput, GetMyOrdersOutput } from "./dtos/get-myorders.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor( private readonly service: OrderService ) {}    
    
    @Role(['Any'])
    @Query(returns => GetMyOrdersOutput)
    getMyOrders(
        @AuthUser() user: User,
        @Args('input') getMyOrdersInput: GetMyOrdersInput
    ): Promise<GetMyOrdersOutput> {
        switch(user.role) {
            case UserRole.Client:
            case UserRole.Delivery:
                return this.service.getMyOrdersForClientAndDelivery(user, getMyOrdersInput)
        }
    }


    @Role(['Client'])
    @Mutation(returns => CreateOrderOutput)
    createOrder(
        @AuthUser() client: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.service.createOrder(client, createOrderInput)
    }
}