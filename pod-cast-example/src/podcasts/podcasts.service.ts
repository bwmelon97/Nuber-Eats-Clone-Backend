import { Injectable } from '@nestjs/common';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { PodcastOutput, PodcastsOutput, SearchPodcastsInput } from "./dtos/get-podcast.dto";
import { CoreOutput } from 'src/common/dtos/core-output.dto';


@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
        @InjectRepository(Episode) private readonly episodes: Repository<Episode>
    ) {}

    private readonly InternalServerErrorOutput = {
        ok: false,
        error: 'Internal server error occurred.',
    };

    /* Find => Relation Option */
    async getAllPodCasts (): Promise<PodcastsOutput> {
        try {
            const podcastList = await this.podcasts.find( {relations: ['episodes']} );   
            return { ok: true, podcasts: podcastList }
        }
        catch {
            return {
                ok: false,
                error: 'Fail to get podcasts'
            }
        }
    }

    async searchPodcasts ( { searchInput }: SearchPodcastsInput ): Promise<PodcastsOutput> {
        try {
            const foundPodcasts = await this.podcasts.find({
                title: ILike(`%${searchInput}%`)
            })
            return { ok: true, podcasts: foundPodcasts }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to search podcasts."
            }
        }
    }
    
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

    async createPodCast ( 
        { title, category }: CreatePodcastInput 
    ): Promise<CoreOutput> {
        try {
            const initalData = { title, category, rating: 0, episodes: [] }
            const newPodcast = this.podcasts.create( initalData )
            await this.podcasts.save(newPodcast)
            return { ok: true }  
        } catch (error) {
            return {
                ok: false,
                error: 'Fail to create podcast'
            }
        }
    }

    async updatePodCast ({ id, data }: UpdatePodcastDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.getPodCastByID(id)
            if ( !ok ) throw Error(error.toString())
            await this.podcasts.update( id, { ...data } )
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to update podcast' 
            } 
        }
    }

    async deletePodCast (pcID: number): Promise<CoreOutput> { 
        try {
            const { ok, error } = await this.getPodCastByID(pcID)
            if ( !ok )  throw Error(error.toString())
            await this.podcasts.delete(pcID)
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to delete podcast' 
            } 
        }
    }
        
    async getEpisodes (pcID: number): Promise<EpisodesOutput> {
        try {
            const { podcast, ok, error } = await this.getPodCastByID(pcID);
            if ( !ok ) throw Error(error.toString())
            return { ok: true, episodes: podcast.episodes }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to get episodes' 
            }  
        }
    }
    
    async createEpisode ( {pcID, data}: CreateEpisodeDTO ): Promise<CoreOutput> {
        try {
            const { ok, error, podcast } = await this.getPodCastByID(pcID);
            if ( !ok ) throw Error(error.toString())
    
            const newEpisode: Episode = this.episodes.create({
                ...data, rating: 0, podcast
            })
            await this.episodes.save(newEpisode);
            return { ok: true };
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to create episode' 
            }  
        }
    }

    async doesEpisodeExist (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const {ok, error, podcast} = await this.getPodCastByID(pcID);
            if ( !ok )  throw Error(error.toString())
            const foundEpisode = podcast.episodes.find(ep => ep.id === epID)            
            if ( !foundEpisode ) throw Error(`Episode id: ${epID} does not exist.`)            
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : `Fail to find episode`  
            } 
        }
    }

    async updateEpisode ( { pcID, epID, data }: UpdateEpisodeDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID);
            if ( !ok ) throw Error(error.toString())
            await this.episodes.update(epID, {...data})
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : `Fail to update episode`  
            } 
        }
    }

    async deleteEpisode (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID)
            if ( !ok ) throw Error(error.toString())
            await this.episodes.delete(epID)
            return { ok: true }
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : `Fail to delete episode`  
            } 
        }
    }
}
