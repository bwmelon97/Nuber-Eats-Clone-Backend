import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User, UserRole } from "src/user/entities/user.entity";
import { ChangeOrderStatusInput, ChangeOrderStatusOutput } from "./dtos/change-order-status.dto";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { GetMyOrdersInput, GetMyOrdersOutput } from "./dtos/get-myorders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
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
            case UserRole.Owner:
                return this.service.getMyOrdersForOwner(user, getMyOrdersInput)
        }
    }

    @Role(['Any'])
    @Query(returns => GetOrderOutput)
    getOrder (
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return this.service.getOrder(user, getOrderInput)
    }

    @Role(['Client'])
    @Mutation(returns => CreateOrderOutput)
    createOrder(
        @AuthUser() client: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.service.createOrder(client, createOrderInput)
    }

    @Mutation(returns => ChangeOrderStatusOutput)
    @Role(['Any'])
    changeOrderStatus(
        @AuthUser() user: User,
        @Args('input') changeOrderStatusInput: ChangeOrderStatusInput
    ): Promise<ChangeOrderStatusOutput> {
        return this.service.changeOrderStatus(user, changeOrderStatusInput)
    }
}