import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    
    it.todo('getPodCastByID');
    it.todo('createPodCast');
    it.todo('updatePodCast');
    it.todo('deletePodCast');
    it.todo('getEpisodes');
    it.todo('createEpisode');
    it.todo('doesEpisodeExist');
    it.todo('updateEpisode');
    it.todo('deleteEpisode');
});
  