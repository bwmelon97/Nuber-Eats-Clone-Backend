import { Field, InputType, Int, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { CreateRestaurantInput } from "./create-restaurant.dto";

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class UpdateRestaurantOutput extends CoreOutput {}