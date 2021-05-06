import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>
    ) {}

    getAllPodCasts = (): Promise<Podcast[]> => this.podcasts.find();   
    getOnePodCastByID = (pcID: number): Promise<Podcast> => this.podcasts.findOne(pcID) 

    createPodCast ( 
        { title, category }: CreatePodcastInput 
    ): Promise<Podcast> {
        const initalData = {title, category, rating: 0}
        const newPodcast = this.podcasts.create( initalData )
        return this.podcasts.save(newPodcast)
    }

    updatePodCast = ({ id, data }: UpdatePodcastDTO ) =>  this.podcasts.update( id, { ...data } )
    deletePodCast = (pcID: number) => this.podcasts.delete(pcID)
        
    // getEpisodes = (pcID: number): Episode[] => {
    //     const selectedID = this.findPodCastIndexByID(pcID);
    //     return this.db.podcasts[selectedID].episodes
    // }

    // createEpisode = ( {pcID, data}: CreateEpisodeDTO ): boolean => {
    //     // const selectedID = this.findPodCastIndexByID(pcID);

    //     // const newEpisode: Episode = {
    //     //     pid: pcID,
    //     //     id: this.db.curEpID++,
    //     //     title, category,
    //     //     rating: 0
    //     // }

    //     // this.db.episodes = this.db.episodes.concat(newEpisode);
    //     // this.db.podcasts[selectedID].episodes.push(newEpisode);
    //     return true;
    // }

    // updateEpisode = ( { pcID, epID, data }: UpdateEpisodeDTO ) => {
    //     // const selectedPcIndex = this.findPodCastIndexByID(pcID);
    //     // const selectedEpIndex = this.findEpisodeIndexByID(epID);

    //     // const updatedEp: Episode = this.db.episodes[selectedEpIndex]

    //     // if ( title )    { updatedEp.title = title }
    //     // if ( category ) { updatedEp.category = category }
    //     // if ( rating )   { updatedEp.rating = rating }

    //     // const indexOfEpInPc = this.db.podcasts[selectedPcIndex].episodes.findIndex(e => e.id === epID)

    //     // this.db.podcasts[selectedPcIndex].episodes = [
    //     //     ...this.db.podcasts[selectedPcIndex].episodes.slice(0, indexOfEpInPc),
    //     //     updatedEp,
    //     //     ...this.db.podcasts[selectedPcIndex].episodes.slice(indexOfEpInPc + 1),
    //     // ]

    //     // return true;
    // }

    // deleteEpisode = (pcID: number, epID: number): boolean => {
    //     const selectedPcIndex = this.findPodCastIndexByID(pcID);
    //     const selectedEpIndex = this.findEpisodeIndexByID(epID);

    //     this.db.podcasts[selectedPcIndex].episodes = this.db.podcasts[selectedPcIndex].episodes.filter(e => e.id !== epID);
    //     this.db.episodes.splice(selectedEpIndex, 1);
        
    //     return true;
    // }

    // findPodCastIndexByID = (pcID: number): number => {
    //     const selectedID = this.db.podcasts.findIndex( pc => pc.id === pcID );
    //     if (selectedID === -1) 
    //         throw new NotFoundException(`Podcast which has id number of ${pcID} is not found.`)
    //     return selectedID
    // }
    
    // findEpisodeIndexByID = (epID: number): number => {
    //     const selectedID = this.db.episodes.findIndex( ep => ep.id === epID );
    //     if (selectedID === -1) 
    //         throw new NotFoundException(`Episode which has id number of ${epID} is not found.`)
    //     return selectedID
    // }
}
