import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastDTO } from './dtos/create-pod-cast.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastDB } from './podcasts.db';

@Injectable()
export class PodcastsService {

    private readonly db = new PodcastDB()

    getAllPodCasts = (): Podcast[] => this.db.podcasts ;
    
    getOnePodCastByID = (pcID: number): Podcast => {
        const podcast = this.db.podcasts.find( pc => pc.id === pcID );
        if (!podcast) 
            throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
        return podcast
    }

    /* Lack of Safty (if params doesn't pass) */
    createPostCast = ( { title, category }: CreatePodcastDTO ): boolean => {
        const newPodcast: Podcast = {
            id: this.db.curPcID++,
            episodes: [],
            rating: 0,
            title, category,
        }

        this.db.podcasts = this.db.podcasts.concat(newPodcast)
        return true
    }
}
