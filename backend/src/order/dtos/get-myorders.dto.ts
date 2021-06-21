import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Order, OrderStatus } from "../entities/order.entity";

@InputType()
export class GetMyOrdersInput extends PaginationInput {
    @Field(type => OrderStatus, { nullable: true })
    status?: OrderStatus;
}

@ObjectType()
export class GetMyOrdersOutput extends PaginationOutput {
    @Field(type => [Order], { nullable: true })
    orders?: Order[];
}