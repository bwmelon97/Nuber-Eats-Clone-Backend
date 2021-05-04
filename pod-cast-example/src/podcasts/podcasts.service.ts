import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcast.entity';
import { podcasts } from './podcasts.db';

@Injectable()
export class PodcastsService {

    getAllPodCasts = (): Podcast[] => podcasts
    
    getOnePodCastByID = (pcID: number): Podcast => {
        const podcast = podcasts.find( pc => pc.id === pcID );
        if (!podcast) 
            throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
        return podcast
    }


}
