import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor( private readonly userService: UserService ) {}

    @Query(returns => [User])
    users() {
        return this.userService.getUser()
    }

    @Query(returns => User)
    @UseGuards(AuthGuard)
    me( @AuthUser() authUser: User ) {
        return authUser
    }

    @Mutation(returns => CreateUserOutput)
    async createUser( 
        @Args('input') createUserInput: CreateUserInput
    ): Promise<CreateUserOutput> {
        try { return this.userService.createUser(createUserInput) } 
        catch (error) { return { ok: false, error } }
    }

    @Mutation(returns => LoginOutput)
    async login (
        @Args('input') loginInput: LoginInput
    ): Promise<LoginOutput> {
        try { return this.userService.login(loginInput) } 
        catch (error) { return { ok: false, error } }
    }
}
