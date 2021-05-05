import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePodcastDTO {
    @Field(is => String)
    readonly title:     string;
    
    @Field(is => String)
    readonly category:  string;
}