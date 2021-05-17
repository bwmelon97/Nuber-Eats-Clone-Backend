import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TEST_PODCAST, WRONG_ID } from './test.constants';
import { getAllPodcastsQuery, getPodcastQuery } from './test.queries';
import { publicTest } from './libs/resolver-test';
import { getDataFromRes } from './libs/getDataFromRes';

describe('App (e2e)', () => {
  let app: INestApplication;
  let podcasts: Repository<Podcast>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    podcasts = module.get(getRepositoryToken(Podcast))
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  })

  describe('Podcasts Resolver', () => {
    
    describe('getAllPodcasts', () => {
      it('should return empty array', () => {
        return publicTest(app, getAllPodcastsQuery)
          .expect(200)
          .expect( (res) => {
            const getAllPodcasts = getDataFromRes(res, 'getAllPodcasts')
            expect(getAllPodcasts).toEqual({
              ok: true,
              error: null,
              podcasts: []
            })
          })
      })
      
      it('should return Podcast Array contains TEST_PODCAST', async () => {
        await podcasts.save(podcasts.create( TEST_PODCAST ))
        return publicTest(app, getAllPodcastsQuery)
          .expect(200)
          .expect( (res) => {
            const getAllPodcasts = getDataFromRes(res, 'getAllPodcasts')
            expect(getAllPodcasts).toEqual({
              ok: true,
              error: null,
              podcasts: [{
                id: 1,
                ...TEST_PODCAST,
              }]
            })
          })
      })
    });
    
    describe('getPodcast', () => {
      it('should return a podcast if get id in DB', () => {
        return publicTest(app, getPodcastQuery(1))
          .expect(200)
          .expect( res => {
            const getPodcast = getDataFromRes(res, 'getPodcast')
            expect(getPodcast).toEqual({
              ok: true,
              error: null,
              podcast: {
                id: 1,
                ...TEST_PODCAST
              }
            })
          })
      })

      it('should fail if get id not in DB', () => {
        return publicTest(app, getPodcastQuery(WRONG_ID))
          .expect(200)
          .expect( res => {
            const getPodcast = getDataFromRes(res, 'getPodcast')
            expect(getPodcast).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`,
              podcast: null
            })
          })
      })
    });

    it.todo('getEpisodes');
    it.todo('createPodcast');
    it.todo('deletePodcast');
    it.todo('updatePodcast');
    it.todo('createEpisode');
    it.todo('updateEpisode');
    it.todo('deleteEpisode');
  });
  describe('Users Resolver', () => {
    it.todo('me');
    it.todo('seeProfile');
    it.todo('createAccount');
    it.todo('login');
    it.todo('editProfile');
  });
});
