import { Field, InputType, IntersectionType, PartialType } from "@nestjs/graphql";
import { CreatePodcastDTO } from "./createPodcastDTO";

@InputType()
class AddFeildClass {
    @Field( is => Number )
    readonly rating?: number;
}

@InputType({isAbstract: true})
export class UpdatePodcastDTO extends PartialType( IntersectionType(CreatePodcastDTO, AddFeildClass) ) { }