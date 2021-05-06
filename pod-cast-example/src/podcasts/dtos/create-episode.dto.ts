import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { Episode } from "../entities/episode.entity";

@InputType()
class CreateEpisodeInput extends PickType(Episode, ['title', 'category']) {}

@ArgsType()
export class CreateEpisodeDTO {
    @Field(type => Number)
    pcID: number;

    @Field(type => CreateEpisodeInput)
    data: CreateEpisodeInput;
}