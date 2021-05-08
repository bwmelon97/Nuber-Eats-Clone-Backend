import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly users: Repository<User>,
        private readonly config: ConfigService,
    ) {}

    getUser = () => this.users.find()

    async createUser( 
        { email, password, role }: CreateUserInput 
    ): Promise<CreateUserOutput> {
        try {
            const existUser = await this.users.findOne( { email } );
            if ( !existUser ) {
                const createdUser = this.users.create({email, password, role})
                this.users.save(createdUser);
                return { ok: true };
            }
            return {
                ok: false,
                error: 'There is a user with that email already'
            }
        } catch (error) { return { ok: false, error: "Couldn't create an accoutn" } }
    }

    async login (
        { email, password }: LoginInput
    ): Promise<LoginOutput> {
        try {
            /* 1. 이메일 확인 */
            const user = await this.users.findOne( { email } );
            if ( !user ) {
                return { 
                    ok: false,
                    error: `User email: ${email} does not exist...`
                }
            }

            /* 2. 비밀번호 확인 */
            const isConfirmed = await user.confirmPassword(password);
            if ( !isConfirmed ) {
                return {
                    ok: false,
                    error: 'Recieve wrong password...'
                }
            }

            /* 3. 토큰 생성 */
            const token = jwt.sign(
                {id: user.id}, 
                this.config.get("PRIVATE_KEY")  
            )

            return { ok: true, token }
        } catch (error) { return { ok: false, error } }
    }
}
