import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";


@InputType()
export class CreateAccountInput extends PickType(
    User, ['email', 'password', 'role'], InputType
) {}