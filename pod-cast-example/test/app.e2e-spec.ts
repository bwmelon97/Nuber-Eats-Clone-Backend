import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TEST_CREATE_PODCAST_INPUT, TEST_PODCAST, TEST_UPDATE_PODCAST_INPUT, WRONG_ID } from './test.constants';
import { createPodcastMutation, getAllPodcastsQuery, getPodcastQuery, updatePodcastMutation } from './test.queries';
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

    describe('createPodcast', () => {
      it('should create a podcast', () => {
        return publicTest(app, createPodcastMutation(TEST_CREATE_PODCAST_INPUT))
          .expect(200)
          .expect( res => {
            const createPodcast = getDataFromRes(res, 'createPodcast')
            expect(createPodcast).toEqual({
              ok: true,
              error: null
            })

            // DB 찾아서 Podcast 만들어진거 확인해야 함
          })
      })
    });

    describe('updatePodcast', () => {
      it('should update a podcast', () => {
        return publicTest(app, updatePodcastMutation(1, TEST_UPDATE_PODCAST_INPUT))
          .expect(200)
          .expect(res => {
            const updatePodCast = getDataFromRes(res, 'updatePodcast')
            expect(updatePodCast).toEqual({
              ok: true,
              error: null
            })

            // DB의 ID가 1인 팟캐스트 데이터가 바뀌었는 지 확인해야 함
            // title만, category만, title category 모두 변경했을 때 각각 그렇게 되었는지 확인해야 함
            // -> 리팩토링 함수 만들고 인자만 바뀌게 해서 테스트하기
          })
      })
      it('should fail if get id not in DB', () => {
        return publicTest(app, updatePodcastMutation(WRONG_ID, TEST_UPDATE_PODCAST_INPUT))
          .expect(200)
          .expect(res => {
            const updatePodCast = getDataFromRes(res, 'updatePodcast')
            expect(updatePodCast).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })
    });

    it.todo('deletePodcast');
   
    it.todo('createEpisode');
    it.todo('getEpisodes');
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
