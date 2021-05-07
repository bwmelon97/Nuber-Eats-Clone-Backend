import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Episode } from "../entities/episode.entity";

@ObjectType()
export class EpisodesOutput extends CoreOutput {
    @Field(type => [Episode], { nullable: true })
    episodes?: Episode[]
} 