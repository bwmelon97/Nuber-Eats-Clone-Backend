import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Podcast } from "src/podcasts/entities/podcast.entity";
import { User } from "../entities/user.entity";

@ObjectType()
class UserWithoutPW extends OmitType(User, ['password']) {}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
    @Field(type => UserWithoutPW, { nullable: true })
    user?: UserWithoutPW;
}

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
    @Field(type => [Podcast], { nullable: true })
    subscriptions?: Podcast[]
}