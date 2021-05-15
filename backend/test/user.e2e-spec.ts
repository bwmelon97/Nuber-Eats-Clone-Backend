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
    let app: INestApplication

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
        const createUserQuery = `
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
            graphqlResolver(createUserQuery)
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
            graphqlResolver(createUserQuery)
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
    
    it.todo('users')
    it.todo('me')
    it.todo('userProfile')
    it.todo('login')
    it.todo('editProfile')
    it.todo('verifyEmail')
})