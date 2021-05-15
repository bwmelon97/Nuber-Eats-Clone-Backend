import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { getConnection } from "typeorm"
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql'
const testUser = {
    email: 'test@mail.com',
    password: 'test'
}

describe('UserModule (e2e)', () => {
    let app: INestApplication;
    let jwtToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await getConnection().dropDatabase()
        await app.close()
    })

    /* Refactor Codes */
    const graphqlResolver = (query: string) =>  
        request(app.getHttpServer())
            .post(GRAPHQL_ENDPOINT)
            .send({ query })

    const getDataFromRes = (res: request.Response, key: string) => res.body.data[key]
    /* ************* */

    describe('createUser', () => {
        const createUserMutation = `
        mutation {
            createUser(input: {
                email: "${testUser.email}"
                password: "${testUser.password}"
                role: Client
            }) {
                ok
                error
            }
        }`

        it('should return status 200 & create an accout', () => {
            return graphqlResolver(createUserMutation)
                .expect(200)
                .expect( res => {
                    const createUser = getDataFromRes(res, 'createUser')
                    expect(createUser).toEqual({
                        ok: true,
                        error: null
                    })
                })
        })

        it('should return status 200 & false if a user exist', () => {
            return graphqlResolver(createUserMutation)
                .expect(200)
                .expect( res => {
                    const createUser = getDataFromRes(res, 'createUser')
                    expect(createUser).toEqual({
                        ok: false,
                        error: expect.any(String)
                    })
                })
        })
    })
    
    describe('login', () => {
        const loginMutation = ( loginInput = testUser ) => `
            mutation {
                login(input: {
                    email: "${loginInput.email}"
                    password: "${loginInput.password}"
                }) {
                    ok
                    error
                    token
                }
            }
        `
        
        it('should return signed token with correct credentials', () => {
            return graphqlResolver(loginMutation())
                .expect(200)
                .expect( res => {
                    const login = getDataFromRes(res, 'login')
                    expect(login).toEqual({
                        ok: true,
                        error: null,
                        token: expect.any(String)
                    })
                    jwtToken = login.token
                })
        })

        it('should failed with wrong email', () => {
            const WRONG_MAIL = 'wrong_email'
            return graphqlResolver(loginMutation({email: WRONG_MAIL, password: testUser.password}))
                .expect(200)
                .expect( res => {
                    const login = res.body.data.login
                    expect(login).toEqual({
                        ok: false,
                        error: `User email: ${WRONG_MAIL} does not exist...`,
                        token: null
                    })
                })
        })

        it('should failed with wrong password', () => {
            const WRONG_PASSWORD = 'wrong_password';
            return graphqlResolver(loginMutation({email: testUser.email, password: WRONG_PASSWORD}))
                .expect(200)
                .expect( res => {
                    const login = getDataFromRes(res, 'login');
                    expect(login).toEqual({
                        ok: false,
                        error: 'Recieve wrong password...',
                        token: null
                    })
                })
        })
    })

    it.todo('users')
    it.todo('me')
    it.todo('userProfile')
    it.todo('editProfile')
    it.todo('verifyEmail')
})