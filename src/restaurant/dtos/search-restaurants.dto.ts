import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput } from "src/common/dtos/pagination.dto";
import { GetRestaurantsOutput } from "./get-restaurants.dto";

@InputType()
export class SearchRestaurantsInput extends PaginationInput {
    @Field(type => String)
    query: string;
}

@ObjectType()
export class SearchRestaurantsOutput extends GetRestaurantsOutput {}