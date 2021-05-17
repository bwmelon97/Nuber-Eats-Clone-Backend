import { ArgsType, Field, InputType, PartialType, PickType } from "@nestjs/graphql";
import { Episode } from "../entities/episode.entity";

@InputType()
export class UpdateEpisodeInput extends PartialType( 
    PickType(Episode, ['title', 'category']) 
) {}

@ArgsType()
export class UpdateEpisodeDTO {
    @Field(type => Number)
    pcID: number;

    @Field(type => Number)
    epID: number

    @Field(type => UpdateEpisodeInput)
    data: UpdateEpisodeInput
}