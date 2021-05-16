import { Field, InputType, PickType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";


@InputType()
export class CreateRestaurantInput extends PickType(
    Restaurant, ['name', 'coverImg', 'address'], InputType
) {
    @Field(type => String)
    categoryName: String
}