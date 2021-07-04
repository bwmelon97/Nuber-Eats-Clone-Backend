import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly users: Repository<User>,
        @InjectRepository(Verification) 
        private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService
    ) { }

    getUser = () => this.users.query('select * from user')

    /**
     * This Method returns User Data without Password Column.
     * @param id 
     * @returns 
     */
    async findUserByID (id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne(id);
            if ( !user ) {
                return {
                    ok: false,
                    error: `User id: ${id} doesn't exist.`
                }
            }
            return { ok: true, user }
        } catch (error) { return { ok: false, error: error.message } }        
    }

    async createUser( 
        { email, password, role }: CreateUserInput 
    ): Promise<CreateUserOutput> {
        try {
            const existUser = await this.users.findOne( { email } );
            if ( existUser ) throw Error('There is a user with that email already')

            const createdUser = this.users.create({email, password, role})
            const user = await this.users.save(createdUser);
            await this.verifications.save(
                this.verifications.create({ user: createdUser })
            )
            const token = this.jwtService.sign({ id: user.id })

            return { ok: true, token };
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : "Couldn't create an account" 
            } 
        }
    }

    async login (
        { email, password }: LoginInput
    ): Promise<LoginOutput> {
        try {
            /* 1. 이메일 확인 */
            const user = await this.users.findOne( 
                { email }, 
                { select: ['password', 'id'] } 
            );
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
            const token = this.jwtService.sign( {id: user.id} )

            return { ok: true, token }
        } catch (error) { return { ok: false, error: error.message } }
    }

    async editProfile ( 
        userID: number, { email, password }: EditProfileInput     
    ): Promise<CoreOutput> {
        try {
            const { user } = await this.findUserByID(userID);
            if ( email ) { user.email = email }
            if ( password ) { user.password = password }
            await this.users.save(user)
            return { ok: true }
        }
        catch (error) {
            return {
                ok: false,
                error: 'Fail to update user profile...'
            }
        }
    }

    async verifyEmail (code: string): Promise<CoreOutput> {
        try {
            const verification = await this.verifications.findOne(
                { code }, { loadRelationIds: true }
            );
            if ( !verification ) { throw Error }
            const verifiedUserId = verification.user;
            await this.users.update(verifiedUserId, { verified: true })
            await this.verifications.delete(verification.id)
            return { ok: true }
        } catch (error) {
            return { 
                ok: false, 
                error: 'Fail to verify Email...'
            }
        }
    }
}
