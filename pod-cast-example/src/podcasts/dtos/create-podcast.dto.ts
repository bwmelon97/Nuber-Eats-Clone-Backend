import { Field, InputType, PickType } from "@nestjs/graphql";
import { Podcast } from "../entities/podcast.entity";

@InputType()
export class CreatePodcastInput extends PickType(Podcast, ['title', 'category'], InputType ) {}