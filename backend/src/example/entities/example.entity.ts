import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Example {
    @Field(type => String)
    name: string;

    @Field(type => Boolean, {nullable: true})
    isGood?: Boolean;
}

@ObjectType()
export class Restaurant {
    @Field(type => String)
    name: string;

    @Field(type => String)
    address?: string;

    @Field(type => String)
    ownerName?: string;

    @Field(type => Boolean, {nullable: true})
    isVeganOnly?: Boolean;
}