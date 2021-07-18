import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/order/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { Dish } from "./dish.entity";

@InputType('RestaurantInputType', { isAbstract: true })
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
        { onDelete: 'CASCADE', nullable: false }    
    )
    owner: User

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number

    @Field(type => Category)
    @ManyToOne( 
        type => Category, 
        category => category.restaurants,
        { onDelete: 'SET NULL', eager: true }
    )
    category: Category

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant
    )
    menu: Dish[]

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.restaurant
    )
    orders: Order[]
}