import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { ItemOption } from "../entities/order-item.entity";

@InputType()
class CreateOrderItem {
    @Field(type => Int)
    dishId: number

    @Field(type => [ItemOption], { nullable: true })
    options?: ItemOption[]
}

@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => [CreateOrderItem])
    items: CreateOrderItem[]
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}