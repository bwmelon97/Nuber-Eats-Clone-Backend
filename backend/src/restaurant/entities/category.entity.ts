import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(type => String)
    @Column({ unique: true })
    name: string;

    @Field(type => String)
    @Column({ nullable: true })
    coverImg: string;

    @Field(type => String)
    @Column({ unique: true })
    slug: string;

    @Field(type => [Restaurant])
    @OneToMany( type => Restaurant, restaurant => restaurant.category )
    restaurants: Restaurant[]
}