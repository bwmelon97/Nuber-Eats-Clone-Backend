import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastDTO } from './dtos/createPodcastDTO';
import { CreateEpisodeDTO } from './dtos/createEpisodeDTO';
import { UpdateEpisodeDTO } from './dtos/updateEpisodeDTO';
import { UpdatePodcastDTO } from './dtos/updatePodcastDTO';
import { Episode } from './entities/episode.entity';
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

        if ( title )    { updatedPodcast.title = title }
        if ( category ) { updatedPodcast.category = category }
        if ( episodes ) { updatedPodcast.episodes = episodes }
        if ( rating )   { updatedPodcast.rating = rating }

        this.db.podcasts = [
            ...this.db.podcasts.slice(0, selectedID),
            updatedPodcast,
            ...this.db.podcasts.slice(selectedID + 1)
        ]
        return true;
    }

    getEpisodes = (pcID: number): Episode[] => {
        const selectedID = this.findPodCastIndexByID(pcID);
        return this.db.podcasts[selectedID].episodes
    }

    createEpisode = (pcID: number, {name}: CreateEpisodeDTO ): boolean => {
        const selectedID = this.findPodCastIndexByID(pcID);

        const newEpisode: Episode = {
            pid: pcID,
            id: this.db.curEpID++,
            name
        }

        this.db.episodes = this.db.episodes.concat(newEpisode);
        this.db.podcasts[selectedID].episodes.push(newEpisode);
        return true;
    }

    deleteEpisode = (pcID: number, epID: number): boolean => {
        const selectedPcIndex = this.findPodCastIndexByID(pcID);
        const selectedEpIndex = this.findEpisodeIndexByID(epID);

        this.db.podcasts[selectedPcIndex].episodes = this.db.podcasts[selectedPcIndex].episodes.filter(e => e.id !== epID);
        this.db.episodes.splice(selectedEpIndex, 1);
        
        return true;
    }

    updateEpisode = (pcID: number, epID: number, { name }: UpdateEpisodeDTO ) => {
        const selectedPcIndex = this.findPodCastIndexByID(pcID);
        const selectedEpIndex = this.findEpisodeIndexByID(epID);

        const updatedEp: Episode = this.db.episodes[selectedEpIndex]

        if ( name )    { updatedEp.name = name }

        const indexOfEpInPc = this.db.podcasts[selectedPcIndex].episodes.findIndex(e => e.id === epID)

        this.db.podcasts[selectedPcIndex].episodes = [
            ...this.db.podcasts[selectedPcIndex].episodes.slice(0, indexOfEpInPc),
            updatedEp,
            ...this.db.podcasts[selectedPcIndex].episodes.slice(indexOfEpInPc + 1),
        ]

        return true;
    }


    findPodCastIndexByID = (pcID: number): number => {
        const selectedID = this.db.podcasts.findIndex( pc => pc.id === pcID );
        if (selectedID === -1) 
            throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
        return selectedID
    }
    
    findEpisodeIndexByID = (epID: number): number => {
        const selectedID = this.db.episodes.findIndex( ep => ep.id === epID );
        if (selectedID === -1) 
            throw new NotFoundException(`Episode which has id number of ${epID} is not found.`)
        return selectedID
    }
}
