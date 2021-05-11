import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/jwt/jwt.service';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>, 
        private readonly jwtService: JwtService
    ) {}

    getUsers = (): Promise<User[]> => this.users.find();

    async createAccount ( 
        { email, password, role }: CreateAccountInput 
    ): Promise<CoreOutput> {
        try {
            /* 1. email 확인 -> 이미 있는 유저이면 fail */    
            const doesExist = await this.users.findOne({ email })
            if (doesExist) throw Error(`User email: ${email} has already existed...`)
    
            /* 2. Create User & DB Save( hash password automatically before insert ) */
            const createdUser = this.users.create({ email, password, role });
            await this.users.save(createdUser)
            
            return { ok: true }
        } catch ( error ) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to create Account...' 
            } 
        }
    }


    async login ( {email, password}: LoginInput ): Promise<LoginOutput> {
        try {
            /* 1. email 확인 */
            const user = await this.users.findOne({ email })
            if ( !user ) throw Error("Couldn't find user with input email...")

            /* 2. password 확인 */
            const confirmed = await user.confirmPassword(password)
            if ( !confirmed ) throw Error("Receive wrong password !!")

            /* 3. Generate Token */
            const token = jwt.sign({id: user.id}, process.env.PRIVATE_KEY)

            return { ok: true, token }
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to login...'
            }
        }
    }
}
