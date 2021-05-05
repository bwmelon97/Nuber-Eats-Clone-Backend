import { Field, InputType, IntersectionType, PartialType } from "@nestjs/graphql";
import { CreateEpisodeDTO } from "./createEpisodeDTO";

@InputType()
class AddFeildClass {
    @Field( is => Number )
    readonly rating?: number;
}

@InputType()
export class UpdateEpisodeDTO extends PartialType( IntersectionType(CreateEpisodeDTO, AddFeildClass) ) {}