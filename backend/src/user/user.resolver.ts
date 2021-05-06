import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor( private readonly userService: UserService ) {}

    @Query(returns => Boolean)
    user() {
        return true;
    }

    @Mutation(returns => CreateUserOutput)
    async createUser( 
        @Args('input') createUserInput: CreateUserInput
    ): Promise<CreateUserOutput> {
        return this.userService.createUser(createUserInput)
    }
}
