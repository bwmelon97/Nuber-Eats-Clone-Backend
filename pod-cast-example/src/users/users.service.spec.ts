import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { JwtService } from "src/jwt/jwt.service"
import { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { UsersService } from "./users.service"

const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
})

const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),   
})

type MockRepository<T = any> = Partial< Record< keyof Repository<T>, jest.Mock > >

describe('UsersService', () => {

    let service: UsersService
    let users: MockRepository<User>
    let jwtService: JwtService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockRepository() },
                { provide: JwtService, useValue: mockJwtService() }
            ]
        }).compile()

        service = module.get<UsersService>(UsersService)
        users = module.get(getRepositoryToken(User))
        jwtService = module.get<JwtService>(JwtService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it.todo('findUserById')
    it.todo('createAccount')
    it.todo('login')
    it.todo('editProfile')
})