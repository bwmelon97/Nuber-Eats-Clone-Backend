import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput } from './dtos/verify-email.dto';
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

    @Query(returns => UserProfileOutput)
    @UseGuards(AuthGuard)
    async userProfile(
        @Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        try { return this.userService.findUserByID(userProfileInput.id) } 
        catch (error) { return { ok: false, error } }
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

    @UseGuards(AuthGuard)
    @Mutation(returns => CoreOutput)
    async editProfile( 
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<CoreOutput> {
        try { 
            const editedUser = await this.userService.editProfile( authUser.id, editProfileInput ) 
            if ( !editedUser ) throw Error
            return { ok: true }
        } 
        catch (error) { return { ok: false, error } }
    }
}

@Resolver()
export class VerificationResolver {
    constructor( private readonly userService: UserService ) {}

    @Mutation(returns => CoreOutput)
    async verifyEmail(
        @Args('input') { code }: VerifyEmailInput
    ): Promise<CoreOutput> {
        try { return this.userService.verifyEmail(code) } 
        catch (error) { return { ok: false, error } }
    }
}