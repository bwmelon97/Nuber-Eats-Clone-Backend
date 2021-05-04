import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastDTO } from './dtos/create-pod-cast.dto';
import { UpdatePodcastDTO } from './dtos/updatePodcastDTO';
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

    updatePodCast = (pcID: number, { title, category, episodes, rating }: UpdatePodcastDTO ): boolean => {
        const selectedID = this.findPodCastIndexByID(pcID);
        const updatedPodcast = this.db.podcasts[selectedID]

        if ( title ) { updatedPodcast.title = title }
        if ( category ) { updatedPodcast.category = category }
        if ( episodes ) { updatedPodcast.episodes = episodes }
        if ( rating ) { updatedPodcast.rating = rating }

        this.db.podcasts = [
            ...this.db.podcasts.slice(0, selectedID),
            updatedPodcast,
            ...this.db.podcasts.slice(selectedID + 1)
        ]
        return true;
    }



    findPodCastIndexByID = (pcID: number): number => {
        const selectedID = this.db.podcasts.findIndex( pc => pc.id === pcID );
        if (selectedID === -1) 
            throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
        return selectedID
    }
}
