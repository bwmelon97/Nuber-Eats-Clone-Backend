import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Category } from "../entities/category.entity";

@ObjectType()
export class GetAllCategoriesOutput extends CoreOutput {
    @Field(type => [Category], { nullable: true })
    categories?: Category[]
}