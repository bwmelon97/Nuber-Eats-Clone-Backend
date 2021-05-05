import { PartialType } from "@nestjs/mapped-types";
import { CreateEpisodeDTO } from "./createEpisodeDTO";

export class UpdateEpisodeDTO extends PartialType(CreateEpisodeDTO) {
    readonly rating?: number;
}