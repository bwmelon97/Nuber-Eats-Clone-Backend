import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CoreOutput {
    @Field(types => Boolean)
    ok: boolean;

    @Field(types => String, {nullable: true})
    error?: String;
}