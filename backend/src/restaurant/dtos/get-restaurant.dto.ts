import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class GetRestaurantByIdInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class GetRestaurantByIdOutput extends CoreOutput {
    @Field(type => Restaurant, { nullable: true })
    restaurant?: Restaurant
}