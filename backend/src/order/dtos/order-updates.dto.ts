import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class OrderUpdatesInput {
    @Field(type => [Int])
    orderIds: number[];
}