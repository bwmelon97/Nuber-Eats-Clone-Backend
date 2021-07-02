import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATES, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { User, UserRole } from "src/user/entities/user.entity";
import { ChangeOrderStatusInput, ChangeOrderStatusOutput } from "./dtos/change-order-status.dto";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { GetMyOrdersInput, GetMyOrdersOutput } from "./dtos/get-myorders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor( 
        private readonly service: OrderService, 
        @Inject(PUB_SUB) private readonly pubsub: PubSub    
    ) {}    
    
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

    @Mutation(returns => Boolean)
    async potatoMutation( @Args('id') potatoId: number ) {
        await this.pubsub.publish('potato', {
            listenPotato: potatoId,
            listenPotatoToo: "What a potato !",
        })
        return true
    }

    @Subscription(returns => Order, {
        filter: (payload, _, context) => {
            const { pendingOrder: { restaurant: { ownerId } } } = payload;
            const { user: { id } } = context;
            return ownerId === id
        },
    })
    @Role(['Owner'])
    pendingOrder() {
        return this.pubsub.asyncIterator(NEW_PENDING_ORDER)
    }

    @Subscription(returns => Order)
    @Role(['Delivery'])
    cookedOrder() {
        return this.pubsub.asyncIterator(NEW_COOKED_ORDER)
    }

    @Subscription(returns => Order, {
        filter: (
            { orderUpdates: order }: { orderUpdates: Order }, 
            { input: { orderIds } }: { input: OrderUpdatesInput },
            { user }: { user: User },
        ) => {
            if (
                order.customerId !== user.id &&
                order.driverId !== user.id &&
                order.restaurant.ownerId !== user.id 
            ) return false;

            return orderIds.includes(order.id);
        }
    })
    @Role(['Any'])
    orderUpdates(@Args('input') _: OrderUpdatesInput ) {
        return this.pubsub.asyncIterator(NEW_ORDER_UPDATES)
    }
}