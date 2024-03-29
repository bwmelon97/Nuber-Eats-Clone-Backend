import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(type => String)
    @Column({ unique: true })
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    coverImg?: string;

    @Field(type => String)
    @Column({ unique: true })
    slug: string;

    @Field(type => [Restaurant], { nullable: true })
    @OneToMany( type => Restaurant, restaurant => restaurant.category )
    restaurants?: Restaurant[]
}