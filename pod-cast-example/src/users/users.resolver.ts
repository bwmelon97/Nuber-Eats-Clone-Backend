
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { SeeProfileOutput, SeeSubscriptionsOutput } from './dtos/see-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor( private readonly usersSerive: UsersService ) {}

    /* only for dev: User DB 확인용 */
    // @Query(returns => [User])
    // users(): Promise<User[]> {
    //     return this.usersSerive.getUsers()
    // }

    @Mutation(returns => CoreOutput)
    createAccount(
        @Args('input') createAccountInput: CreateAccountInput
    ): Promise<CoreOutput> {
        return this.usersSerive.createAccount(createAccountInput)
    }

    @Mutation(returns => LoginOutput)
    login(
        @Args('input') loginInput: LoginInput
    ): Promise<LoginOutput> {
        return this.usersSerive.login(loginInput)
    }

    @Role(['Any'])
    @Query(returns => SeeProfileOutput)
    me( @AuthUser() authUser: User ): Promise<SeeProfileOutput> {
        return this.usersSerive.findUserById( authUser.id )
    }

    @Role(['Any'])
    @Mutation(returns => CoreOutput)
    editProfile (
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<CoreOutput> {
        return this.usersSerive.editProfile(authUser, editProfileInput)
    }

    @Role(['Any'])
    @Query(returns => SeeProfileOutput)
    seeProfile( @Args('id') id: number ): Promise<SeeProfileOutput> {
        return this.usersSerive.findUserById( id )
    }

    @Role(['Listener'])
    @Query(returns => SeeSubscriptionsOutput)
    seeSubscriptions( @AuthUser() authUser: User ): Promise<SeeSubscriptionsOutput> {
        return this.usersSerive.seeSubscriptions(authUser)
    }
}
