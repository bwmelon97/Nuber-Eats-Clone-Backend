
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor( private readonly usersSerive: UsersService ) {}

    /* only for dev: User DB 확인용 */
    @Query(returns => [User])
    users(): Promise<User[]> {
        return this.usersSerive.getUsers()
    }

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
}
