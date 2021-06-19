import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Dish } from "src/restaurant/entities/dish.entity";

@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => [Dish])
    dishes: Dish[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}