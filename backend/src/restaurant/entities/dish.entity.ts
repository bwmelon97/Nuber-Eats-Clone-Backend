import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    name: string;

    @Field(type => Int)
    @Column()
    price: number;

    @Field(type => String)
    @Column()
    photo: string;

    @Field(type => String)
    @Column()
    description: string;

    @Field(type => Restaurant)
    @ManyToOne( 
        type => Restaurant, 
        restaurant => restaurant.menu,
        { onDelete: 'CASCADE', nullable: false }
    )
    restaurant: Restaurant

    @RelationId( (dish: Dish) => dish.restaurant )
    restaurantId: number
}