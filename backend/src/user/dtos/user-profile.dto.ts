import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";

@ArgsType()
export class UserProfileInput {
    @Field(types => Number)
    id: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
    @Field(types => User, { nullable: true })
    user?: User
}