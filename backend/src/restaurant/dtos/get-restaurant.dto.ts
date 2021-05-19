import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Restaurant } from "../entities/restaurant.entity";

@ObjectType()
export class GetAllRestaurantsOutput extends CoreOutput {
    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[]
}