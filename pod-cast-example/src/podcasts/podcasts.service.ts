import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastDTO } from './dtos/create-pod-cast.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastDB } from './podcasts.db';

@Injectable()
export class PodcastsService {

    private readonly db = new PodcastDB()

    getAllPodCasts = (): Podcast[] => this.db.podcasts ;
    
    getOnePodCastByID = (pcID: number): Podcast => this.db.podcasts[this.findPodCastIndexByID(pcID)] 

    /* Lack of Safty (if params doesn't pass) */
    createPodCast = ( { title, category }: CreatePodcastDTO ): boolean => {
        const newPodcast: Podcast = {
            id: this.db.curPcID++,
            episodes: [],
            rating: 0,
            title, category,
        }

        this.db.podcasts = this.db.podcasts.concat(newPodcast)
        return true
    }

    deletePodCast = (pcID: number): boolean => {
        const selectedID = this.findPodCastIndexByID(pcID);
        this.db.podcasts.splice(selectedID, 1)
        return true;
    }





    findPodCastIndexByID = (pcID: number): number => {
        const selectedID = this.db.podcasts.findIndex( pc => pc.id === pcID );
        if (selectedID === -1) 
            throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
        return selectedID
    }
}
