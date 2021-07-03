import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class DeleteDishInput {
    @Field(type => Int)
    dishId: number;
}