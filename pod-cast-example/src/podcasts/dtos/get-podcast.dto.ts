import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Podcast } from "../entities/podcast.entity";

@ObjectType()
export class PodcastOutput extends CoreOutput {
    @Field(type => Podcast, { nullable: true })
    podcast?: Podcast;
}

@ObjectType()
export class PodcastsOutput extends CoreOutput {
    @Field(type => [Podcast], { nullable: true })
    podcasts?: Podcast[];
}

@InputType()
export class SearchPodcastsInput {
    @Field(type => String)
    searchInput: string;
}