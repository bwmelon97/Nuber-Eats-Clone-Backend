import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
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

    @Role(['Any'])
    @Query(returns => User)
    me( @AuthUser() authUser: User ) {
        return authUser
    }

    @Role(['Any'])
    @Query(returns => UserProfileOutput)
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

    @Role(['Any'])
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