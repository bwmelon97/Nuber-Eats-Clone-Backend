import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TEST_CREATE_ACCOUNT_INPUT, TEST_CREATE_EPISODE_INPUT, TEST_CREATE_PODCAST_INPUT, TEST_EDIT_PROFILE_INPUT, TEST_EPISODE, TEST_LOGIN_INPUT, TEST_PODCAST, TEST_UPDATE_EPISODE_INPUT, TEST_UPDATE_PODCAST_INPUT, TEST_USER, WRONG_EMAIL, WRONG_ID, WRONG_PASSWORD } from './test.constants';
import { createAccountMutation, createEpisodeMutation, createPodcastMutation, deleteEpisodeMutation, deletePodcastMutation, editProfileMutation, getAllPodcastsQuery, getEpisodesQuery, getPodcastQuery, loginMutation, meQuery, seeProfileQuery, updateEpisodeMutation, updatePodcastMutation } from './test.queries';
import { privateTest, publicTest } from './libs/resolver-test';
import { getDataFromRes } from './libs/getDataFromRes';

describe('App (e2e)', () => {
  let app: INestApplication;
  let podcasts: Repository<Podcast>
  let jwtToken: string;

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
            const updatePodcast = getDataFromRes(res, 'updatePodcast')
            expect(updatePodcast).toEqual({
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
            const updatePodcast = getDataFromRes(res, 'updatePodcast')
            expect(updatePodcast).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })
    });

    describe('deletePodcast', () => {
      it('should fail if get id not in DB', () => {
        return publicTest(app, deletePodcastMutation(WRONG_ID))
          .expect(200)
          .expect(res => {
            const deletePodcast = getDataFromRes(res, 'deletePodcast')
            expect(deletePodcast).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })
      it('should delete podcast', () => {
        // Episode 생성하기
        return publicTest(app, deletePodcastMutation(1))
          .expect(200)
          .expect(res => {
            const deletePodcast = getDataFromRes(res, 'deletePodcast')
            expect(deletePodcast).toEqual({
              ok: true,
              error: null
            })

            // DB 확인해서 데이터가 정말 사라졌는지 확인해야 함.
            // Podcast 삭제 시 하위 Episode까지 사라지는 지 확인해야 함.
          })
      })
    });
   
    describe('createEpisode', () => {
      // 시작 전에 DB를 리셋시키면 좋겠다.
      it('should fail if get pocast id, not in DB', () => {
        // 리팩토링하면 좋을 듯 (public 테스트에 들어가는 query 또는 mutation만 바뀜)
        return publicTest(app, createEpisodeMutation(WRONG_ID, TEST_CREATE_EPISODE_INPUT))
          .expect(200)
          .expect(res => {
            const createEpisode = getDataFromRes(res, 'createEpisode')
            expect(createEpisode).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })

      it('should create an episode', () => {
        return publicTest(app, createEpisodeMutation(2, TEST_CREATE_EPISODE_INPUT))
          .expect(200)
          .expect(res => {
            const createEpisode = getDataFromRes(res, 'createEpisode')
            expect(createEpisode).toEqual({
              ok: true,
              error: null
            })
          })
      })
    });

    describe('getEpisodes', () => {
      // DB 초기화 하고 테스트하면 더 좋을 텐데...
      it('should fail if get pocast id, not in DB', () => {
        // 리팩토링하면 좋을 듯 (public 테스트에 들어가는 query 또는 mutation만 바뀜)
        return publicTest(app, getEpisodesQuery(WRONG_ID))
          .expect(200)
          .expect(res => {
            const getEpisodes = getDataFromRes(res, 'getEpisodes')
            expect(getEpisodes).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`,
              episodes: null
            })
          })
      })

      it('should return episode array contain TEST_EPISODE (id: 1)', () => {
        return publicTest(app, getEpisodesQuery(2))
          .expect(200)
          .expect(res => {
            const getEpisodes = getDataFromRes(res, 'getEpisodes')
            expect(getEpisodes).toEqual({
              ok: true,
              error: null,
              episodes: [{
                id: 1,
                ...TEST_EPISODE
              }]
            })
          })
      })
    });

    describe('updateEpisode', () => {
      it('should fail if get podcast id not in DB', () => {
        return publicTest(app, updateEpisodeMutation(WRONG_ID, 1, TEST_UPDATE_EPISODE_INPUT))
          .expect(200)
          .expect(res => {
            const updateEpisode = getDataFromRes(res, 'updateEpisode')
            expect(updateEpisode).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })
      it('should fail if get episode id not in DB', () => {
        return publicTest(app, updateEpisodeMutation(2, WRONG_ID, TEST_UPDATE_EPISODE_INPUT))
          .expect(200)
          .expect(res => {
            const updateEpisode = getDataFromRes(res, 'updateEpisode')
            expect(updateEpisode).toEqual({
              ok: false,
              error: `Episode id: ${WRONG_ID} does not exist.`
            })
          })
      })
      it('should update episode', () => {
        return publicTest(app, updateEpisodeMutation(2, 1, TEST_UPDATE_EPISODE_INPUT))
          .expect(200)
          .expect(res => {
            const updateEpisode = getDataFromRes(res, 'updateEpisode')
            expect(updateEpisode).toEqual({
              ok: true,
              error: null
            })

            // DB 확인 필요
          })
      })
    });

    describe('deleteEpisode', () => {
      it('should fail if get podcast id not in DB', () => {
        return publicTest(app, deleteEpisodeMutation(WRONG_ID, 1))
          .expect(200)
          .expect(res => {
            const deleteEpisode = getDataFromRes(res, 'deleteEpisode')
            expect(deleteEpisode).toEqual({
              ok: false,
              error: `Podcast id: ${WRONG_ID} doesn't exist.`
            })
          })
      })
      it('should fail if get episode id not in DB', () => {
        return publicTest(app, deleteEpisodeMutation(2, WRONG_ID))
          .expect(200)
          .expect(res => {
            const deleteEpisode = getDataFromRes(res, 'deleteEpisode')
            expect(deleteEpisode).toEqual({
              ok: false,
              error: `Episode id: ${WRONG_ID} does not exist.`
            })
          })
      })
      it('should delete episode', () => {
        return publicTest(app, deleteEpisodeMutation(2, 1))
          .expect(200)
          .expect(res => {
            const deleteEpisode = getDataFromRes(res, 'deleteEpisode')
            expect(deleteEpisode).toEqual({
              ok: true,
              error: null
            })

            // DB 확인 필요
          })
      })
    });
  });

  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should create an account', () => {
        return publicTest(app, createAccountMutation(TEST_CREATE_ACCOUNT_INPUT))
          .expect(200)
          .expect(res => {
            const createAccount = getDataFromRes(res, 'createAccount')
            expect(createAccount).toEqual({
              ok: true,
              error: null
            })

            // DB 확인 필요
          })
      })
      it('should fail if account exist', () => {
        return publicTest(app, createAccountMutation(TEST_CREATE_ACCOUNT_INPUT))
          .expect(200)
          .expect(res => {
            const createAccount = getDataFromRes(res, 'createAccount')
            expect(createAccount).toEqual({
              ok: false,
              error: `User email: ${TEST_CREATE_ACCOUNT_INPUT.email} has already existed...`
            })

            // DB 확인 필요
          })
      })
    });

    describe('login', () => {
      it('should fail if get wrong email', () => {
        return publicTest(app, loginMutation({email: WRONG_EMAIL, password: TEST_LOGIN_INPUT.password}))
          .expect(200)
          .expect(res => {
            const login = getDataFromRes(res, 'login')
            expect(login).toEqual({
              ok: false,
              error: `Couldn't find a user...`,
              token: null
            })
          })
      })
      it('should fail if get wrong password', () => {
        return publicTest(app, loginMutation({email: TEST_LOGIN_INPUT.email, password: WRONG_PASSWORD}))
          .expect(200)
          .expect(res => {
            const login = getDataFromRes(res, 'login')
            expect(login).toEqual({
              ok: false,
              error: `Receive wrong password !!`,
              token: null
            })
          })
      })
      it('should return token if login success', () => {
        return publicTest(app, loginMutation(TEST_LOGIN_INPUT))
          .expect(200)
          .expect(res => {
            const login = getDataFromRes(res, 'login')
            jwtToken = login.token
            expect(login).toEqual({
              ok: true,
              error: null,
              token: expect.any(String)
            })
          })
      })
    });
    
    describe('me', () => {
      it('should fail with public request', () => {
        return publicTest(app, meQuery)
          .expect(200)
          .expect(res => {
            const [error] = res.body.errors
            expect(error.message).toBe('Forbidden resource')
          })
      })
      it('should return my profile', () => {
        return privateTest(app, meQuery, jwtToken)
          .expect(200)
          .expect(res => {
            const me = getDataFromRes(res, 'me')
            expect(me).toEqual({
              ok: true,
              error: null,
              user: TEST_USER
            })
          })
      })
    });

    describe('seeProfile', () => {
      it('should fail with public request', () => {
        return publicTest(app, seeProfileQuery(1))
          .expect(200)
          .expect(res => {
            const [error] = res.body.errors
            expect(error.message).toBe('Forbidden resource')
          })
      })
      it('should fail with user id not in DB', () => {
        return privateTest(app, seeProfileQuery(WRONG_ID), jwtToken)
          .expect(200)
          .expect(res => {
            const seeProfile = getDataFromRes(res, 'seeProfile')
            expect(seeProfile).toEqual({
              ok: false,
              error: "Couldn't find a user...",
              user: null
            })
          })
      })
      it('should return profile', () => {
        return privateTest(app, seeProfileQuery(1), jwtToken)
          .expect(200)
          .expect(res => {
            const seeProfile = getDataFromRes(res, 'seeProfile')
            expect(seeProfile).toEqual({
              ok: true,
              error: null,
              user: TEST_USER
            })
          })
      })
    });

    describe('editProfile', () => {
      it('should fail with public request', () => {
        return publicTest(app, editProfileMutation(TEST_EDIT_PROFILE_INPUT))
          .expect(200)
          .expect(res => {
            const [error] = res.body.errors
            expect(error.message).toBe('Forbidden resource')
          })
      })
      it('should update profile', () => {
        return privateTest(app, editProfileMutation(TEST_EDIT_PROFILE_INPUT), jwtToken)
          .expect(200)
          .expect(res => {
            const editProfile = getDataFromRes(res, 'editProfile')
            expect(editProfile).toEqual({
              ok: true,
              error: null,
            })

            // DB를 직접 확인해보면 좋겠다.
          })
      })
    });
  });
});
