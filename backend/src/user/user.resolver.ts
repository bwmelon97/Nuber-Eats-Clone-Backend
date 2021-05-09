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
    userProfile(
        @Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        return this.userService.findUserByID(userProfileInput.id)
    }

    @Mutation(returns => CreateUserOutput)
    createUser( 
        @Args('input') createUserInput: CreateUserInput
    ): Promise<CreateUserOutput> {
        return this.userService.createUser(createUserInput)
    }

    @Mutation(returns => LoginOutput)
    login (
        @Args('input') loginInput: LoginInput
    ): Promise<LoginOutput> {
        return this.userService.login(loginInput)
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => CoreOutput)
    editProfile( 
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<CoreOutput> {
        return this.userService.editProfile( authUser.id, editProfileInput ) 
    }
}

@Resolver()
export class VerificationResolver {
    constructor( private readonly userService: UserService ) {}

    @Mutation(returns => CoreOutput)
    verifyEmail(
        @Args('input') { code }: VerifyEmailInput
    ): Promise<CoreOutput> {
        return this.userService.verifyEmail(code) 
    }
}