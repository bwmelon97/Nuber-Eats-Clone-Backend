import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePodcastInput } from "./dtos/create-podcast.dto";
import { CreateEpisodeDTO } from "./dtos/create-episode.dto";
import { UpdatePodcastDTO } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";
import { UpdateEpisodeDTO } from "./dtos/update-episode.dto";


const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
})

type MockRepository<T = any> = Partial< Record< keyof Repository<T>, jest.Mock > >

describe('PodcastsService', () => {

    let service: PodcastsService;
    let podcasts: MockRepository<Podcast>;
    let episodes: MockRepository<Episode>;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                PodcastsService,
                { provide: getRepositoryToken(Podcast), useValue: mockRepository() },
                { provide: getRepositoryToken(Episode), useValue: mockRepository() },
            ]
        }).compile()

        service = module.get<PodcastsService>(PodcastsService)
        podcasts = module.get(getRepositoryToken(Podcast))
        episodes = module.get(getRepositoryToken(Episode))
    })

    const couldNotFindPodcast = async ( key/* : keyof PodcastsService */, ...params ) => {
        podcasts.findOne.mockResolvedValue(null)
        const result = await service[key](...params)
        expect(result).toEqual({
            ok: false,
            error: `Podcast id: 1 doesn't exist.`
        })
    }

    
    it('should be defined', () => {
        expect(service).toBeDefined()
    });

    describe('getAllPodCasts', () => {

        it('should return podcasts', async () => {
            const mockPodcast = {id: 1}
            podcasts.find.mockResolvedValue([mockPodcast])
            const result = await service.getAllPodCasts();
            
            expect(podcasts.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                ok: true,
                podcasts: [mockPodcast]
            })
        })

        it('should failed on exception', async () => {
            podcasts.find.mockRejectedValue(new Error());
            const result = await service.getAllPodCasts();

            expect(result).toEqual({
                ok: false,
                error: 'Fail to get podcasts'
            })
        })

    });
    
    describe('getPodCastByID', () => {
        it('should return a podcast', async () => {
            const mockPodcast = {id: 1}
            podcasts.findOne.mockResolvedValue(mockPodcast)

            const result = await service.getPodCastByID(1);
            expect(podcasts.findOne).toHaveBeenCalledWith( expect.any(Number), {relations: ['episodes']} )
            expect(result).toEqual(
                { ok: true, podcast: mockPodcast }
            )
        })

        it('should failed if could not find podcast', async () => {
            podcasts.findOne.mockResolvedValue(null)
            const result = await service.getPodCastByID(1);
            expect(result).toEqual({
                ok: false,
                error: `Podcast id: 1 doesn't exist.`
            })
        })

        it('should failed on exception', async () => {
            podcasts.findOne.mockRejectedValue(new Error())
            const result = await service.getPodCastByID(1);
            expect(result).toEqual({
                ok: false,
                error: new Error()
            })
        })
    })

    describe('createPodCast', () => {
        const createPodcastArgs: CreatePodcastInput = {
            title: 'mock', category: 'mock'
        }

        it('should create a new user', async () => {
            const mockUser = {
                title: 'mock', category: 'mock', rating: 0, episodes: []
            }
            podcasts.create.mockReturnValue(mockUser)
            podcasts.save.mockResolvedValue(mockUser)

            const result = await service.createPodCast(createPodcastArgs)
            expect(podcasts.create).toHaveBeenCalledWith(mockUser)
            expect(podcasts.save).toHaveBeenCalledWith(mockUser)
            expect(result).toEqual( { ok: true } )
        })

        it('should failed on exception', async () => {
            podcasts.save.mockRejectedValue(new Error())

            const result = await service.createPodCast(createPodcastArgs)
            expect(result).toEqual({
                ok: false,
                error: 'Fail to create podcast'
            })
        })
    })

    describe('updatePodCast', () => {
        const updatePodcastArgs: UpdatePodcastDTO = {
            id: 1,
            data: {
                title: 'updated'
            }
        }
        const mockPodcast = { id: 1 }
        
        it('should return ok true if updating success', async () => {
            podcasts.findOne.mockResolvedValue(mockPodcast)
            podcasts.update.mockResolvedValue(mockPodcast)

            const result = await service.updatePodCast(updatePodcastArgs)
            expect(podcasts.update).toHaveBeenCalledWith( expect.any(Number), { title: 'updated' } )
            expect(result).toEqual({ ok: true })
        })

        it('should failed if could not find podcast',  () => {
            couldNotFindPodcast( 'updatePodCast', updatePodcastArgs )
        })

        it('should failed on exception', async () => {
            podcasts.findOne.mockResolvedValue(mockPodcast)
            podcasts.update.mockRejectedValue(new Error(':)'))
            const result = await service.updatePodCast(updatePodcastArgs)
            expect(result).toEqual({ 
                ok: false,
                error: `:)`
            })
        })
    })

    describe('deletePodCast', () => {
        const mockPodcast = { id: 1 }

        it('should failed if could not find podcast',  () => {
            couldNotFindPodcast( 'deletePodCast', 1 )
        })

        it('should return ok true if deleting success', async () => {
            podcasts.findOne.mockResolvedValue(mockPodcast)
            podcasts.delete.mockResolvedValue(true)
            const result = await service.deletePodCast(1);
            expect(podcasts.delete).toHaveBeenCalledWith( expect.any(Number) )
            expect(result).toEqual({ ok: true })
        })

        it('should failed on exception', async () => {
            podcasts.findOne.mockResolvedValue(mockPodcast)
            podcasts.delete.mockRejectedValue(new Error(':('))
            const result = await service.deletePodCast(1);
            expect(result).toEqual({ 
                ok: false,
                error: `:(`
            })
        })
    })



    describe('getEpisodes', () => {
        it('should failed if could not find podcast',  () => {
            couldNotFindPodcast( 'getEpisodes', 1 )
        })

        it('should return true & episodes if find podcast', async () => {
            const mockPodcast = { id: 1, episodes: [] }
            podcasts.findOne.mockResolvedValue(mockPodcast)
            const result = await service.getEpisodes(1)
            expect(result).toEqual({
                ok: true,
                episodes: []
            })
        })
    })

    describe('createEpisode', () => {
        const mockCreateEpisodeData: CreateEpisodeDTO = {
            pcID: 1,
            data: {
                title: 'mock',
                category: 'mock'
            }
        }

        it('should failed if could not find podcast', async () => {
            couldNotFindPodcast('createEpisode', mockCreateEpisodeData)
        })

        it('should create Episode & return true', async () => {
            const mockPodcast = { id: 1 }
            const mockEpisode = {
                title: 'mock',
                category: 'mock',
                rating: 0, 
                podcast: mockPodcast
            }
            podcasts.findOne.mockResolvedValue(mockPodcast)
            episodes.create.mockReturnValue(mockEpisode)

            const result = await service.createEpisode(mockCreateEpisodeData)
            expect(episodes.create).toHaveBeenCalledWith(mockEpisode)
            expect(episodes.save).toHaveBeenCalledWith(mockEpisode)
            expect(result).toEqual({ ok: true })
        })

        it('should failed on exception', async () => {
            const mockPodcast = { id: 1 }
            const mockEpisode = {
                title: 'mock',
                category: 'mock',
                rating: 0, 
                podcast: mockPodcast
            }
            podcasts.findOne.mockResolvedValue(mockPodcast)
            episodes.create.mockReturnValue(mockEpisode)
            episodes.save.mockRejectedValue(new Error(':('))

            const result = await service.createEpisode(mockCreateEpisodeData)
            expect(result).toEqual({ 
                ok: false,
                error: ':('
            })
        })
    })

    describe('doesEpisodeExist', () => {
        it('should fail if podcast does not exist', () => {
            couldNotFindPodcast('doesEpisodeExist', 1, 1)
        })
        it('should fail if episode does not exist', async () => {
            const mockUser = {
                id: 1,
                episodes: []
            }
            podcasts.findOne.mockResolvedValue(mockUser)

            const result = await service.doesEpisodeExist(1, 1);
            expect(result).toEqual({
                ok: false,
                error: `Episode id: 1 does not exist.`
            })
        })
        it('should return true if episode exist', async () => {
            const mockUser = {
                id: 1,
                episodes: [{id: 1}]
            }
            podcasts.findOne.mockResolvedValue(mockUser)

            const result = await service.doesEpisodeExist(1, 1);
            expect(result).toEqual({
                ok: true
            })
        })
        // it.todo('should failed on exception')
    })

    describe('updateEpisode', () => {
        const mockUpdateEpisodeDTO: UpdateEpisodeDTO = {
            pcID: 1,
            epID: 1,
            data: {
                title: 'mock'
            }
        }

        it('should failed if episode does not exist', () => {
            couldNotFindPodcast( 'updateEpisode', mockUpdateEpisodeDTO )
        })
        it('should update episode & return true', async () => {
            const mockUser = {
                id: 1,
                episodes: [{id: 1}]
            }
            podcasts.findOne.mockResolvedValue(mockUser)

            const result = await service.updateEpisode(mockUpdateEpisodeDTO)
            expect(episodes.update).toHaveBeenCalledWith( expect.any(Number), mockUpdateEpisodeDTO.data )
            expect(result).toEqual({ ok: true })
        })
        // it.todo('should failed on exception')
    })

    describe('deleteEpisode', () => {
        it('should failed if episode does not exist', () => {
            couldNotFindPodcast( 'deleteEpisode', 1, 1 )
        })
        it('should delete episode & return true', async () => {
            const mockUser = {
                id: 1,
                episodes: [{id: 1}]
            }
            podcasts.findOne.mockResolvedValue(mockUser)

            const result = await service.deleteEpisode(1, 1)
            expect(episodes.delete).toHaveBeenCalledWith( expect.any(Number) )
            expect(result).toEqual({ ok: true })
        })
    })
});
  