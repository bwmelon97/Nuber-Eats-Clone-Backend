import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { UserService } from "./user.service"


const mockRepository = {
    query: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
}

const mockJwtService = {
    sign: jest.fn()
}

describe("UserService", () => {

    let service: UserService;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockRepository },
                { provide: getRepositoryToken(Verification), useValue: mockRepository },
                { provide: JwtService, useValue: mockJwtService }
            ]
        }).compile();
        service = module.get<UserService>(UserService)
    } )

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    it.todo('findUserByID')
    it.todo('createUser')
    it.todo('login')
    it.todo('editProfile')
    it.todo('verifyEmail')
})