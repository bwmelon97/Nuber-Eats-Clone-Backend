import { Field, InputType, IntersectionType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends IntersectionType(
    PickType ( User, ['email', 'password', 'role'] ),
    PartialType( PickType(User, ['profileImg'] ))
) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
    @Field(type => String, { nullable: true })
    token?: string;
}