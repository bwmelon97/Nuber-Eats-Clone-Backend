import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { SeeProfileOutput, SeeSubscriptionsOutput } from './dtos/see-profile.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>, 
        private readonly jwtService: JwtService
    ) {}

    // getUsers = (): Promise<User[]> => this.users.find({
    //     select: ['id', 'email', 'password' ,'role', 'updatedAt', 'createdAt']
    // })

    async findUserById ( id: number ): Promise<SeeProfileOutput> {
        try {
            const user = await this.users.findOne(id, { relations: ['subscriptions', 'playedEpisodes'] })
            if ( !user ) throw Error
            return { ok: true, user }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't find a user..."
            }
        }
    }

    async seeSubscriptions ( listener: User ): Promise<SeeSubscriptionsOutput> {
        try {
            const { subscriptions } = await this.users.findOne( listener.id, { relations: ['subscriptions'] } )
            return { ok: true, subscriptions: subscriptions }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to load subscriptions.'
            }
        }
    }

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
            const user = await this.users.findOne(
                { email },
                { select: ['id', 'password'] }    
            )
            if ( !user ) throw Error("Couldn't find a user...")

            /* 2. password 확인 */
            const confirmed = await user.confirmPassword(password)
            if ( !confirmed ) throw Error("Receive wrong password !!")

            /* 3. Generate Token */
            const token = this.jwtService.sign({id: user.id})

            return { ok: true, token }
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to login...'
            }
        }
    }

    async editProfile ( 
        authUser: User, {email, password, role}: EditProfileInput )     
    {
        try {
            const user = await this.users.findOne( authUser.id );
            if ( !user ) throw Error('Couldn\'t find a user...')

            if ( email )    { user.email = email }
            if ( password ) { user.password = password }
            // if ( role )     { user.role = role }  <- 안 바뀌는 이유를 모르겠음..
            await this.users.save(user)
            return { ok: true }
        } catch(error) {
            return {
                ok: false,
                error: error ? error.message : 'Could not update User Profile...'
            }
        }
    }
}
