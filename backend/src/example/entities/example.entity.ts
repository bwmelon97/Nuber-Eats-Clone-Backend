import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
export class Example {
    @Field(type => String)
    name: string;

    @Field(type => Boolean, {nullable: true})
    isGood?: Boolean;
}

@ObjectType()
@Entity()
export class Restaurant {
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;
    
    @Field(type => String)
    @Column()
    name: string;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownerName: string;

    @Field(type => Boolean, {nullable: true})
    @Column()
    isVeganOnly: Boolean;
}