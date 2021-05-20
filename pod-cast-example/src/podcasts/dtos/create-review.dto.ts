import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Review } from "../entities/review.entity";

@InputType()
export class CreateReviewInput extends PickType( 
    Review, ['description'], InputType 
) {
    @Field(type => Number)
    podcastId: number
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {}