import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { PodcastOutput } from "./dtos/get-podcast.dto";


@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>
    ) {}

    getAllPodCasts = (): Promise<Podcast[]> => this.podcasts.find();   
    
    async getPodCastByID (pcID: number): Promise<PodcastOutput> {
        try {
            const foundPodcast = await this.podcasts.findOne(pcID);
            if (!foundPodcast) 
                return {
                    ok: false,
                    error: `Podcast id: ${pcID} doesn't exist.`
                }
            return { ok: true, podcast: foundPodcast }
        } catch (error) { return { ok: false, error } }
    }

    createPodCast ( 
        { title, category }: CreatePodcastInput 
    ): Promise<Podcast> {
        const initalData = { title, category, rating: 0, episodes: [] }
        const newPodcast = this.podcasts.create( initalData )
        /* newPodcast의 데이터가 유효한 지 확인하고 싶음 */
        /* 현재 Podcast entity에서 episodes 필드에 Default value가 없는 경우에러 발생 */
        return this.podcasts.save(newPodcast)
    }

    updatePodCast = ({ id, data }: UpdatePodcastDTO ) => this.podcasts.update( id, { ...data } )
    deletePodCast = (pcID: number) => this.podcasts.delete(pcID)
        
    async getEpisodes (pcID: number): Promise<EpisodesOutput> {
        try {
            const { podcast, ok, error } = await this.getPodCastByID(pcID);
            if ( !ok ) return { ok, error } // podcast를 찾는 과정에서 에러 생기면 리턴
            
            /* episodes에 값이 들어있지 않으면 null을 리턴해서 빈 배열을 리턴하도록 함;; */
            if ( !podcast.episodes ) return { ok: true, episodes: [] }
            /* ***************************************************************** */
            
            return { ok: true, episodes: podcast.episodes }
        } catch (error) { return { ok: false, error } }
    }

    // async createEpisode ( {pcID, data}: CreateEpisodeDTO ) {
    //     const foundPodcast = await this.podcasts.findOne(pcID);
        
        // const selectedID = this.findPodCastIndexByID(pcID);

        // const newEpisode: Episode = {
        //     pid: pcID,
        //     id: this.db.curEpID++,
        //     title, category,
        //     rating: 0
        // }

        // this.db.episodes = this.db.episodes.concat(newEpisode);
        // this.db.podcasts[selectedID].episodes.push(newEpisode);
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
