import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { Dish } from "../entities/dish.entity";

@InputType()
export class UpdateDishData extends PartialType(
    PickType( Dish, ['name', 'photo', 'price', 'options', 'description'], InputType)
) {}

@InputType()
export class UpdateDishInput {
    @Field(type => Int)
    dishId: number;

    @Field(type => UpdateDishData)
    data: UpdateDishData;
}