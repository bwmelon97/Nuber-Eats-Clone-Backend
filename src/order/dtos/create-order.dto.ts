import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { OrderItemOption } from "../entities/order-item.entity";

@InputType()
class CreateOrderItemInput {
    @Field(type => Int)
    dishId: number

    @Field(type => [OrderItemOption], { nullable: true })
    itemOptions?: OrderItemOption[]
}

@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => [CreateOrderItemInput])
    itemInputs: CreateOrderItemInput[]
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}