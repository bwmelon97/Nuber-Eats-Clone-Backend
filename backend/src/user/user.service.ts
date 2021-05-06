import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly users: Repository<User>
    ) {}

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
                error: 'User has this email already exist.'
            }
        } catch (error) { return { ok: false, error } }
    }
}
