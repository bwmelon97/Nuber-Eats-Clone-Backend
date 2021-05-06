import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends PickType (
    User, ['email', 'password', 'role'], InputType
) { }

@ObjectType()
export class CreateUserOutput {
    @Field(types => Boolean)
    ok: boolean;

    @Field(types => String, {nullable: true} )
    error?: string;
}