import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { JwtService } from "src/jwt/jwt.service"
import { Repository } from "typeorm"
import { CreateAccountInput } from "./dtos/create-account.dto"
import { EditProfileInput } from "./dtos/edit-profile.dto"
import { LoginInput } from "./dtos/login.dto"
import { User, UserRole } from "./entities/user.entity"
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
type MockService<T> = Partial< Record< keyof T, jest.Mock > >

describe('UsersService', () => {

    let service: UsersService
    let users: MockRepository<User>
    let jwtService: MockService<JwtService>

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
        jwtService = module.get(JwtService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    const couldNotFindUser = async ( key/* : keyof PodcastsService */, ...params ) => {
        users.findOne.mockResolvedValue(null)
        const result = await service[key](...params)
        expect(result).toEqual({
            ok: false,
            error: `Couldn't find a user...`
        })
    }

    describe('findUserById', () => {
        it('should failed if could not find user', () => {
            couldNotFindUser('findUserById', 1)
        })
        it('should return true & user', async () => {
            const mockUser = {id: 1}
            users.findOne.mockResolvedValue(mockUser)
            const result = await service.findUserById(1)
            expect(result).toEqual({
                ok: true, user: mockUser
            })
        })
    })

    describe('createAccount', () => {
        const mockCreateAccountInput: CreateAccountInput = {
            email: 'mock',
            password: 'mock',
            role: UserRole.Host
        }

        it('should failed if user exist', async () => {
            const mockUser = {email: 'mock'}
            users.findOne.mockResolvedValue(mockUser)
            const result = await service.createAccount(mockCreateAccountInput)
            expect(result).toEqual({
                ok: false,
                error: `User email: ${mockUser.email} has already existed...`
            })
        })

        it('should return true & create User', async () => {
            users.findOne.mockResolvedValue(null)
            users.create.mockReturnValue(mockCreateAccountInput)
            const result = await service.createAccount(mockCreateAccountInput)
            
            expect(users.create).toHaveBeenCalledWith(mockCreateAccountInput)
            expect(users.save).toHaveBeenCalledWith(mockCreateAccountInput)
            expect(result).toEqual({ ok: true })
        })
    })

    describe('login', () => {
        const mockLoginInput: LoginInput = {
            email: 'mock',
            password: 'mock'
        }
        const mockUser = (isCorrect: boolean) => ({
            id: 1,
            confirmPassword: jest.fn( () => Promise.resolve(isCorrect) )
        })

        it('should failed if could not find user with email', () => {
            couldNotFindUser('login', mockLoginInput)
        })

        it('should failed if password is not correct', async () => {
            users.findOne.mockResolvedValue(mockUser(false))
            const result = await service.login(mockLoginInput)
            expect(result).toEqual({
                ok: false,
                error: "Receive wrong password !!"
            })
        })

        it('should return true & token', async () => {
            const TOKEN = 'TOKEN'
            users.findOne.mockResolvedValue(mockUser(true))
            jwtService.sign.mockReturnValue(TOKEN)

            const result = await service.login(mockLoginInput)
            expect(jwtService.sign).toHaveBeenCalledWith( {id: mockUser(true).id} )
            expect(result).toEqual({
                ok: true, token: TOKEN
            })
        })
    })

    describe('editProfile', () => {
        const mockAuthUser = {
            id: 1,
            email: 'mock',
            password: 'mock'
        }
        const mockEditProfileInput: EditProfileInput = {
            email: 'mock_edited',
            password: 'mock_edited'
        }

        it('should failed if could not find user', () => {
            couldNotFindUser('editProfile', mockAuthUser, mockEditProfileInput)
        })
        it('should change user data & return true', async () => {
            users.findOne.mockResolvedValue(mockAuthUser)
            const result = await service.editProfile(mockAuthUser as User, mockEditProfileInput)

            expect(users.save).toHaveBeenCalledWith({
                ...mockEditProfileInput,
                id: mockAuthUser.id
            })
            expect(result).toEqual({ ok: true })
        })
    })
})