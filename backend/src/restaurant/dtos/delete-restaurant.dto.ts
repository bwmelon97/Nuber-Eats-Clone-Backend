import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";

@InputType()
export class DeleteRestaurantInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}