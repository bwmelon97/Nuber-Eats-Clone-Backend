import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";

export class PodcastDB {
    curPcID: number = 1;
    podcasts: Podcast[] = [];
    
    curEpID: number = 1;
    episodes: Episode[] = [];
}