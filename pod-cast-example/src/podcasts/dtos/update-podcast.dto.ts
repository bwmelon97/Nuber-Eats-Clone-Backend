import { ArgsType, Field, InputType, PartialType, PickType } from "@nestjs/graphql";
import { Podcast } from "../entities/podcast.entity";

@InputType()
export class UpdatePodcastInput extends PartialType( 
    PickType(Podcast, ['title', 'category', 'rating']),
    InputType
) { }

@ArgsType()
export class UpdatePodcastDTO {
    @Field(type => Number)
    id: number;

    @Field(type => UpdatePodcastInput)
    data: UpdatePodcastInput;
}