import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Category } from "../entities/category.entity";
import { Restaurant } from "../entities/restaurant.entity";


@InputType()
export class GetCategoryInput extends PaginationInput {
    @Field(type => String)
    nameInput: string;
}

@ObjectType()
export class GetCategoryOutput extends PaginationOutput {
    @Field(type => Category, { nullable: true })
    category?: Category

    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[]
}