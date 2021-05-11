import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User> 
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
                error: error ? error : 'Fail to create Account...' 
            } 
        }
    }
}
