import { InputType, PickType } from "@nestjs/graphql";
import { Verification } from "../entities/verification.entity";

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code'], InputType) {}