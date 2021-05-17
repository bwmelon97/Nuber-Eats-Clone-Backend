import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";

@ObjectType()
class UserWithoutPW extends OmitType(User, ['password']) {}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
    @Field({ nullable: true })
    user?: UserWithoutPW;
}