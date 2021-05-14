import { Test } from "@nestjs/testing"
import * as jwt from 'jsonwebtoken'
import { JWT_OPTIONS } from "./jwt.constants"
import { JwtOptions } from "./jwt.interfaces"
import { JwtService } from "./jwt.service"


const TEST_KEY = 'test_key'
const TOKEN = 'TOKEN'
const PAYLOAD = 'PAYLOAD'

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => TOKEN),
        verify: jest.fn(() => PAYLOAD)
    }
})

const mockOptions: JwtOptions = {
    privateKey: TEST_KEY
}

describe('JwtService', () => {
    let service: JwtService
    let options: JwtOptions

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtService,
                { provide: JWT_OPTIONS, useValue: mockOptions }
            ]
        }).compile()
        service = module.get<JwtService>(JwtService)
        options = module.get(JWT_OPTIONS)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('sign', () => {
        it('should recieve payload and private key', () => {
            service.sign(PAYLOAD)
            expect( jwt.sign ).toHaveBeenCalledWith(PAYLOAD, TEST_KEY)
        })

        it('should return a token', () => {
            const result = service.sign(PAYLOAD)
            expect(typeof result).toBe('string')
            expect(result).toEqual(TOKEN)
        })
    })

    describe('verify', () => {
        it('should recieve token and private key', () => {
            service.verify(TOKEN)
            expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY)
        })

        it('should return a decoded token (payload)', () => {
            const result = service.verify(TOKEN)
            expect(result).toEqual(PAYLOAD)
        })
    })
})