import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePodcastInput } from "./dtos/create-podcast.dto";
import { UpdatePodcastDTO, UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";


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
    })

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

        it('should failed if could not find podcast', async () => {
            podcasts.findOne.mockResolvedValue(null)
            const result = await service.updatePodCast(updatePodcastArgs)
            expect(result).toEqual({ 
                ok: false,
                error: `Podcast id: 1 doesn't exist.`
            })
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

        it('should failed if could not find podcast', async () => {
            podcasts.findOne.mockResolvedValue(null)
            const result = await service.deletePodCast(1);
            expect(result).toEqual({
                ok: false,
                error: `Podcast id: 1 doesn't exist.`
            })
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

    it.todo('getEpisodes');
    it.todo('createEpisode');
    it.todo('doesEpisodeExist');
    it.todo('updateEpisode');
    it.todo('deleteEpisode');
});
  