import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { Dish } from "./dish.entity";

@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    
    @Field(type => String)
    @Column()
    name: string;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    coverImg: string;

    @Field(type => User)
    @ManyToOne(
        type => User, 
        user => user.restaurants,
        { onDelete: 'CASCADE' }    
    )
    owner: User

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerID: number

    @Field(type => Category)
    @ManyToOne( 
        type => Category, 
        category => category.restaurants,
        { onDelete: 'SET NULL' }
    )
    category: Category

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant
    )
    menu: Dish[]
}