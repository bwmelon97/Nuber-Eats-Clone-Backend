import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { getConnection, Repository } from "typeorm"
import * as request from 'supertest';
import { User } from "src/user/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

const GRAPHQL_ENDPOINT = '/graphql'
const testUser = {
    email: 'test@mail.com',
    password: 'test'
}

describe('UserModule (e2e)', () => {
    let app: INestApplication;
    let jwtToken: string;
    let users: Repository<User>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ AppModule ]
        }).compile()

        app = module.createNestApplication()
        users = module.get(getRepositoryToken(User))
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

    const graphqlResolverWithHeader = (
        query: string, {key, data}: {key: string, data: string}
    ) => {
    return graphqlResolver(query).set(key, data)
}

    const getDataFromRes = (res: request.Response, key: string) => res.body.data[key]

    const shouldFailedWithoutValidToken = (query: string) => 
        graphqlResolver(query)
        .expect(200)
        .expect( res => {
            const { body: { data, errors } } = res
            expect(data).toBe(null)
            expect(errors[0].message).toBe('Forbidden resource')
        })
        
    type Header = { key: string, data: string }
    
    const testMyProfile = (
        header: Header, 
        testMail: string
    ) => { 
        const meQuery = `
        query {
            me {
                email
            }
        }`
        return graphqlResolverWithHeader(meQuery, header)
            .expect(200)
            .expect( res => {
                const me = getDataFromRes(res, 'me')
                expect(me).toEqual({ email: testMail })
            })
    }

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
        type LoginInput = { email: string, password: string }
        const loginMutation = ( loginInput: LoginInput ) => `
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
            return graphqlResolver(loginMutation(testUser))
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

    describe('userProfile', () => {
        const userProfileQuery = ( id: number = 1 ) => `
        query {
            userProfile(id: ${id}) {
                ok
                error
                user {
                    id
                }
            }
        }`
        let header: Header
        beforeAll(() => {
            header = {
                key: 'x-jwt',
                data: jwtToken
            }
        })

        it('should failed if does not get verified token', 
            () => shouldFailedWithoutValidToken(userProfileQuery())
        )

        it('should failed if recieve user id does not exist in DB', () => {
            const ID_NOT_EXIST = 999;
            return graphqlResolverWithHeader(userProfileQuery(ID_NOT_EXIST), header)
                .expect(200)
                .expect( res => {
                    const userProfile = getDataFromRes(res, 'userProfile')
                    expect(userProfile).toEqual({
                        ok: false,
                        error: `User id: ${ID_NOT_EXIST} doesn't exist.`,
                        user: null
                    })
                })
        })
        it('should return true if user exist', async () => {
            const [user] = await users.find()
            const userID = user.id
            return graphqlResolverWithHeader(userProfileQuery(userID), header)
                .expect(200)
                .expect( res => {
                    const userProfile = getDataFromRes(res, 'userProfile')
                    expect(userProfile).toEqual({
                        ok: true,
                        error: null,
                        user: { id: userID }
                    })
                })
        })
    })

    

    describe('me', () => {
        const meQuery = `
        query {
            me {
                email
            }
        }`
        let header: Header
        beforeAll(() => {
            header = { key: 'x-jwt', data: jwtToken }
        })

        it('should failed if does not get verified token', 
            () => shouldFailedWithoutValidToken(meQuery)
        )

        it('should return my profile data if logged in', () => 
            testMyProfile(header, testUser.email)
        )
    })

    describe('editProfile', () => {
        type EditProfileInput = Partial<{ email: string, password: string }>
        const editProfileMutation = ({email, password}: EditProfileInput) => `
            mutation {
                editProfile(input: {
                    ${email ? `email: "${email}"` : ''}
                    ${password ? `password: "${password}"` : ''}
                }) {
                    ok
                    error
                }
            }
        `
        let header: Header
        beforeAll(() => { header = { key: 'x-jwt', data: jwtToken } })
        
        it('should failed if does not get verified token', () => {
            shouldFailedWithoutValidToken(editProfileMutation({}))
        })
        
        it('should change email', () => {
            const NEW_EMAIL = 'new@mail.com'
            return graphqlResolverWithHeader(
                editProfileMutation({ email: NEW_EMAIL }),
                header
            )
                .expect(200)
                .expect( res => {
                    const editProfile = getDataFromRes(res, 'editProfile')
                    expect(editProfile).toEqual({
                        ok: true,
                        error: null
                    })                    
                })
                .then(() => {   // 이메일 확인 테스트
                    return testMyProfile(header, NEW_EMAIL)
                })
                
        })

        it('should success login with new password', () => {
            const NEW_PASSWORD = 'new_password';
            return graphqlResolverWithHeader(
                editProfileMutation({ email: testUser.email, password: NEW_PASSWORD }),
                header
            )
                .expect(200)
                .expect( res => {
                    const editProfile = getDataFromRes(res, 'editProfile')
                    expect(editProfile).toEqual({
                        ok: true,
                        error: null
                    })    
                })
                .then(() => {   // 로그인 테스트
                    type LoginInput = { email: string, password: string }
                    const loginMutation = ( loginInput: LoginInput ) => `
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
                    return graphqlResolver(loginMutation({email: testUser.email, password: NEW_PASSWORD}))
                        .expect(200)
                        .expect( res => {
                            const login = getDataFromRes(res, 'login')
                            expect(login).toEqual({
                                ok: true,
                                error: null,
                                token: expect.any(String)
                            })
                        })
                })
        })
    })

    it.todo('verifyEmail')
})