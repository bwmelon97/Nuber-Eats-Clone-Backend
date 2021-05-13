import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { UserService } from "./user.service"


const mockRepository = () => ({
    query: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
})

const mockJwtService = () => ({
    sign: jest.fn(() => 'signed-token-hello')
})

type MockRepository<T = any> = Partial< Record< keyof Repository<T>, jest.Mock > >

describe("UserService", () => {

    let service: UserService;
    let jwtService: JwtService;
    let userRepository: MockRepository<User>;
    let verificationRepository: MockRepository<Verification>;
    
    const sampleUser: CreateUserInput = {
        email: "sample@naver.com",
        password: "sample",
        role: 0
    }

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockRepository() },
                { provide: getRepositoryToken(Verification), useValue: mockRepository() },
                { provide: JwtService, useValue: mockJwtService() }
            ]
        }).compile();
        service = module.get<UserService>(UserService)
        jwtService = module.get<JwtService>(JwtService)
        userRepository = module.get(getRepositoryToken(User))
        verificationRepository = module.get(getRepositoryToken(Verification))
    } )

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('findUserByID', () => {

        it('should fail if couldn\'t find user', async () => {
            userRepository.findOne.mockResolvedValue(undefined)
            const result = await service.findUserByID(1)
            expect(result).toMatchObject({
                ok: false,
                error: 'User id: 1 doesn\'t exist.'
            })
        })

        it('should return user if it finds', async () => {
            userRepository.findOne.mockResolvedValue(sampleUser)
            const result = await service.findUserByID(1)
            expect(result).toMatchObject({
                ok: true,
                user: sampleUser
            })
        })

        it('should return error if it rejects', async () => {
            const errorMsg = 'fail to find user'
            userRepository.findOne.mockRejectedValue(new Error(errorMsg))
            const result = await service.findUserByID(1)
            expect(result).toMatchObject({
                ok: false,
                error: errorMsg
            })
        })
    })

    describe('createUser', () => {
        
        it('should be failed if user exists', async () => {
            userRepository.findOne.mockResolvedValue(sampleUser)
            const result = await service.createUser(sampleUser)
            expect(result).toMatchObject({ 
                ok: false, 
                error: 'There is a user with that email already'
            })
        })

        it("should create a user", async () => {
            const sampleVerification = { user: sampleUser }
            userRepository.findOne.mockResolvedValue(undefined)
            userRepository.create.mockReturnValue(sampleUser)
            verificationRepository.create.mockReturnValue(sampleVerification)

            const result = await service.createUser(sampleUser)
            expect(userRepository.create).toBeCalledTimes(1);
            expect(userRepository.create).toBeCalledWith(sampleUser);

            expect(userRepository.save).toBeCalledTimes(1);
            expect(userRepository.save).toBeCalledWith(sampleUser);

            expect(verificationRepository.create).toBeCalledTimes(1);
            expect(verificationRepository.create).toBeCalledWith(sampleVerification);

            expect(verificationRepository.save).toBeCalledTimes(1);
            expect(verificationRepository.save).toBeCalledWith(sampleVerification);
        
            expect(result).toMatchObject( { ok: true } )
        })

        it("should fail if rejected on save user", async () => {
            const errorMsg = 'potato'
            userRepository.save.mockRejectedValue(new Error(errorMsg))
            const result = await service.createUser(sampleUser);

            expect(result).toMatchObject({
                ok: false,
                error: errorMsg
            })
        })
    })

    describe('login', () => {
        const loginArgs: LoginInput = {
            email: 'sample@naver.com',
            password: "sample"
        }

        
        it('should fail if user does not exist', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await service.login(loginArgs)
            expect(result).toEqual({
                ok: false,
                error: `User email: sample@naver.com does not exist...`
            })
        })
        
        it('should fail if wrong password', async () => {
            const mockUser = { confirmPassword: jest.fn(() => Promise.resolve(false)) }
            userRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.login(loginArgs)
            expect(mockUser.confirmPassword).toBeCalledTimes(1)
            expect(mockUser.confirmPassword).toBeCalledWith( expect.any(String) )
            expect(result).toEqual({
                ok: false,
                error: 'Recieve wrong password...'
            })
        })

        it('should return token if password is correct', async () => {
            const mockUser = { 
                id: 1,
                confirmPassword: jest.fn(() => Promise.resolve(true)) 
            }
            userRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.login(loginArgs);
            expect(jwtService.sign).toBeCalledTimes(1);
            expect(jwtService.sign).toBeCalledWith( expect.any( Object ) );
            expect(result).toEqual({ ok: true, token: 'signed-token-hello' })
        })

        it('should fail on exception', async () => {
            userRepository.findOne.mockRejectedValue(new Error('fail to login'));
            const result = await service.login(loginArgs);
            expect(result).toEqual({
                ok: false,
                error: 'fail to login'
            })
        })
    })

    describe('editProfile', () => {
        const editProfileArgs = {
            id: 1, newUser: { email: 'sample@new.com', password: 'sample' }
        }
        
        it('should change email & password', async () => {
            const oldUser = { email: 'sample@old.com', password: 'old' }
            userRepository.findOne.mockResolvedValue(oldUser)

            const result = await service.editProfile( editProfileArgs.id, editProfileArgs.newUser )
            expect(userRepository.save).toHaveBeenCalledWith( editProfileArgs.newUser );
            expect(result).toEqual({ ok: true })
        })

        it('should fail on exception', async () => {
            userRepository.findOne.mockRejectedValue(new Error())
            const result = await service.editProfile( editProfileArgs.id, editProfileArgs.newUser )
            expect(result).toEqual({
                ok: false,
                error: 'Fail to update user profile...'
            })
        })
    })

    describe('verifyEmail', () => {
        const verifyEmailArgs = 'code'

        it('should fail if verification not found', async () => {
            verificationRepository.findOne.mockResolvedValue(null)
            const result = await service.verifyEmail(verifyEmailArgs)
            expect(result).toEqual({
                ok: false, 
                error: 'Fail to verify Email...'
            })
        })

        it('should verify user', async () => {
            verificationRepository.findOne.mockResolvedValue({
                code: verifyEmailArgs,
                user: 1
            })
            
            const result = await service.verifyEmail(verifyEmailArgs)
            expect(userRepository.update).toHaveBeenCalledWith( expect.any(Number), { verified: true } )
            expect(result).toEqual({ ok: true })
        })

        it('should fail on exception', async () => {
            verificationRepository.findOne.mockRejectedValue(new Error())
            const result = await service.verifyEmail(verifyEmailArgs)
            expect(result).toEqual({
                ok: false, 
                error: 'Fail to verify Email...'
            })
        })
    })
})