import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/user/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor( private readonly service: OrderService ) {}    

    @Role(['Client'])
    @Mutation(returns => CreateOrderOutput)
    createOrder(
        @AuthUser() client: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.service.createOrder(client, createOrderInput)
    }
}