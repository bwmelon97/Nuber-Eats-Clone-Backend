import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { getConnection } from "typeorm"

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

    it.todo('users')
    it.todo('me')
    it.todo('userProfile')
    it.todo('createUser')
    it.todo('login')
    it.todo('editProfile')
    it.todo('verifyEmail')
})