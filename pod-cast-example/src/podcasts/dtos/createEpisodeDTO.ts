import { InputType } from "@nestjs/graphql";
import { CreatePodcastDTO } from "./createPodcastDTO";

@InputType()
export class CreateEpisodeDTO extends CreatePodcastDTO {}