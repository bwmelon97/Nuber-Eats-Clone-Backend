import { Test } from "@nestjs/testing"
import { JwtService } from "./jwt.service"

// const mockJwt = {
//     sign: jest.fn(),
//     verify: jest.fn(),
// }

describe('JwtService', () => {
    let service: JwtService
    // let jwt: typeof mockJwt

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [JwtService]
        }).compile()
        service = module.get<JwtService>(JwtService)
        // jwt = mockJwt
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it.todo('sign')
    it.todo('verify')
})