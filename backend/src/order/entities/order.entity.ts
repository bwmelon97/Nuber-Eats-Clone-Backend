import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' })

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {

    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User, user => user.orders,
        { onDelete: 'SET NULL' }
    )
    customer?: User;

    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User, user => user.carries,
        { onDelete: 'SET NULL' }
    )
    driver?: User;

    @Field(type => Restaurant, { nullable: true })
    @ManyToOne(
        type => Restaurant, restaurant => restaurant.orders,
        { onDelete: 'SET NULL' }
    )
    restaurant?: Restaurant;

    @Field(type => [Dish])
    @ManyToMany( type => Dish )
    @JoinTable()
    dishes: Dish[];

    @Field(type => Number)
    @Column()
    total: number;

    @Field(type => OrderStatus)
    @Column({ 
        type: 'enum', enum: OrderStatus, 
        default: OrderStatus.Pending 
    })
    status: OrderStatus;
}