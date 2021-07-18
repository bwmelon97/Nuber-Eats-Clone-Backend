import { InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput } from "src/common/dtos/pagination.dto";
import { GetRestaurantsOutput } from "./get-restaurants.dto";

@InputType()
export class GetMyRestaurantsInput extends PaginationInput {}

@ObjectType()
export class GetMyRestaurantsOutput extends GetRestaurantsOutput {}