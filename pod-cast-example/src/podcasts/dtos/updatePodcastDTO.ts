import { PartialType } from "@nestjs/mapped-types";
import { Episode } from "../entities/episode.entity";
import { CreatePodcastDTO } from "./createPodcastDTO";

export class UpdatePodcastDTO extends PartialType(CreatePodcastDTO) {
    readonly rating?:   number;
    readonly episodes?: Episode[];
}


