import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreatePodcastDTO } from "./createPodcastDTO";

@InputType({isAbstract: true})
export class UpdatePodcastDTO extends PartialType(CreatePodcastDTO) {
    @Field(is => Number)
    readonly rating?:   number;
}