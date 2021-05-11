import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class LoginInput extends PickType( 
    User, ['email', 'password'], InputType 
) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
    @Field(types => String, { nullable: true })
    token?: string;
}