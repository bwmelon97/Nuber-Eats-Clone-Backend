import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";


@InputType('ChoiceInputType', { isAbstract: true })
@ObjectType()
class DishChoice {
    @Field(type => String)
    name: string;

    @Field(type => Int, { nullable: true })
    extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
class DishOption {
    @Field(type => String)
    name: string;

    @Field(type => Int, { nullable : true })
    extra?: number;

    @Field(type => [DishChoice], { nullable: true })
    choices?: DishChoice[]
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    name: string;

    @Field(type => Int)
    @Column()
    price: number;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
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

    @Field(type => [DishOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options: DishOption[]
}