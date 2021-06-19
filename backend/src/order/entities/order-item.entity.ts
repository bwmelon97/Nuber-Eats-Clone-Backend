import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType('OrderItemOptionInput', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field(type => String)
    name: string;

    @Field(type => String, { nullable: true })
    choiceName?: string
}

@InputType('OrderItemInput', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(type => Dish)
    @ManyToOne(type => Dish, { onDelete: 'CASCADE' })
    dish: Dish

    @Field(type => OrderItemOption, { nullable: true })
    @Column({type: 'json', nullable: true})
    chosenOptions?: OrderItemOption[]

    @Field(type => Number)
    @Column()
    ItemPrice: number
}