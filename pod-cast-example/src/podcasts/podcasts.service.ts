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
import { User } from 'src/users/entities/user.entity';
import { CreateReviewInput, CreateReviewOutput } from './dtos/create-review.dto';
import { Review } from './entities/review.entity';


@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
        @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
        @InjectRepository(Review) private readonly reviews: Repository<Review>,
    ) {}

    /* Find => Relation Option */
    async getAllPodCasts (): Promise<PodcastsOutput> {
        try {
            const podcastList = await this.podcasts.find( {relations: ['episodes', 'reviews']} );   
            // 찾은 Review에게서 Writer를 탐색하려면 어떻게 해야 ?
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
                title: ILike(`%${searchInput}%`),
                // relation은 어떻게 추가하지 ?
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
            const foundPodcast = await this.podcasts.findOne(pcID, {relations: ['episodes', 'reviews']});
            if (!foundPodcast) 
                return {
                    ok: false,
                    error: `Podcast id: ${pcID} doesn't exist.`
                }
            return { ok: true, podcast: foundPodcast }
        } catch (error) { 
            return { 
                ok: false, 
                error: error? error.message : "Fail to find podcast." 
            } 
        }
    }

    async createPodCast ( 
        { title, category }: CreatePodcastInput 
    ): Promise<CoreOutput> {
        try {
            const initalData = { title, category, rating: 0, episodes: [], reviews: [] }
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

    async createPodcastReview (
        writer: User,
        { podcastId, description }: CreateReviewInput
    ): Promise<CreateReviewOutput> {
        try {
            const { ok, error, podcast } = await this.getPodCastByID( podcastId );
            if (!ok) throw Error(error)

            const newReivew = this.reviews.create({ description, writer, podcast })
            await this.reviews.save(newReivew)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Podcast Review."
            }
        }
    }

    async subscribePodcast ( 
        user: User,
        podcastId: number 
    ): Promise<CoreOutput> {
        try {
            const { ok, error, podcast } = await this.getPodCastByID( podcastId );
            if (!ok) throw Error(error)
            
            const subscriber = await this.users.findOne( user.id, { relations: ['subscriptions'] } )
            subscriber.subscriptions = subscriber.subscriptions.concat([podcast])
            this.users.save(subscriber)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Podcast Review."
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
