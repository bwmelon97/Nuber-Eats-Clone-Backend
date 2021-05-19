import { Field, InputType, Int, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { Dish } from "../entities/dish.entity";

@InputType()
export class CreateDishInput extends IntersectionType(
    PickType( Dish, ['name', 'description', 'price', 'restaurantId'], InputType),
    PartialType( PickType( Dish, ['photo', 'options'], InputType) )
) {
    @Field( type => Int )
    restaurantId: number;
}