import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";


const mockRepository = () => ({
    find: jest.fn,
    findOne: jest.fn,
    create: jest.fn,
    save: jest.fn,
    update: jest.fn,
    delete: jest.fn,
})

describe('PodcastsService', () => {

    let service: PodcastsService;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                PodcastsService,
                { provide: getRepositoryToken(Podcast), useValue: mockRepository },
                { provide: getRepositoryToken(Episode), useValue: mockRepository },
            ]
        }).compile()

        service = module.get<PodcastsService>(PodcastsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    });


    it.todo('getAllPodCasts');
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
  