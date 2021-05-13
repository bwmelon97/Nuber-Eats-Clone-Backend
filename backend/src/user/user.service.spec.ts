import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
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

const mockJwtService = {
    sign: jest.fn()
}

type MockRepository<T = any> = Partial< Record< keyof Repository<T>, jest.Mock > >

describe("UserService", () => {

    let service: UserService;
    let userRepository: MockRepository<User>;
    let verificationRepository: MockRepository<Verification>;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockRepository() },
                { provide: getRepositoryToken(Verification), useValue: mockRepository() },
                { provide: JwtService, useValue: mockJwtService }
            ]
        }).compile();
        service = module.get<UserService>(UserService)
        userRepository = module.get(getRepositoryToken(User))
        verificationRepository = module.get(getRepositoryToken(Verification))
    } )

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('createUser', () => {
        const sampleUser: CreateUserInput = {
            email: "sample@naver.com",
            password: "sample",
            role: 0
        }
        
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

    it.todo('findUserByID')
    it.todo('login')
    it.todo('editProfile')
    it.todo('verifyEmail')
})