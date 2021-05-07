import { Injectable } from '@nestjs/common';
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
import { CoreOutput } from 'src/common/dtos/core-output.dto';


@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
        @InjectRepository(Episode) private readonly episodes: Repository<Episode>
    ) {}

    /* Find => Relation Option */
    getAllPodCasts = (): Promise<Podcast[]> => this.podcasts.find( {relations: ['episodes']} );   
    
    async getPodCastByID (pcID: number): Promise<PodcastOutput> {
        try {
            const foundPodcast = await this.podcasts.findOne(pcID, {relations: ['episodes']});
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

    async updatePodCast ({ id, data }: UpdatePodcastDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.getPodCastByID(id)
            if ( !ok )  return { ok, error }
            await this.podcasts.update( id, { ...data } )
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }

    async deletePodCast (pcID: number) { 
        try {
            const { ok, error } = await this.getPodCastByID(pcID)
            if ( !ok )  return { ok, error }
            await this.podcasts.delete(pcID)
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }
        
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
    
    async createEpisode ( {pcID, data}: CreateEpisodeDTO ): Promise<CoreOutput> {
        const { ok, error, podcast } = await this.getPodCastByID(pcID);
        if ( !ok )  return { ok, error }

        const newEpisode: Episode = this.episodes.create({
            ...data, rating: 0, podcast
        })

        this.episodes.save(newEpisode);
        return { ok: true };
    }

    async doesEpisodeExist (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const {ok, error} = await this.getPodCastByID(pcID);
            if ( !ok )  return { ok, error } 
            const foundEpisode = await this.episodes.findOne(epID);
            if ( !foundEpisode ) return {
                ok: false,
                error: `Episode id: ${epID} does not exist.`
            }
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }

    async updateEpisode ( { pcID, epID, data }: UpdateEpisodeDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID);
            if ( !ok )  return { ok, error }  
            await this.episodes.update(epID, {...data})
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }

    async deleteEpisode (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID)
            if ( !ok ) return { ok, error}
            await this.episodes.delete(epID)
            return { ok: true }
        } catch (error) { return { ok: false, error } }
    }
}
