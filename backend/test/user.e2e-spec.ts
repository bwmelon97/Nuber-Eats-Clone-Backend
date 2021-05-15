import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { getConnection } from "typeorm"
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql'

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

    describe('createUser', () => {
        const createUserQuery = `
        mutation {
            createUser(input: {
                email: "test@mail.com"
                password: "test"
                role: Client
            }) {
                ok
                error
            }
        }`

        it('should return status 200 & create an accout', () => {
            request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .send({ query: createUserQuery })
                .expect(200)
                .expect( res => {
                    expect(res.body.data.createUser).toEqual({
                        ok: true,
                        error: null
                    })
                })
        })

        it('should return status 200 & false if a user exist', () => {
            request(app.getHttpServer())
            .post(GRAPHQL_ENDPOINT)
            .send({ query: createUserQuery })
            .expect(200)
            .expect( res => {
                expect(res.body.data.createUser).toEqual({
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