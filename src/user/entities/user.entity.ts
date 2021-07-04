import { ObjectType, Field, registerEnumType, InputType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { CoreEntity } from "src/common/entities/core.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Order } from "src/order/entities/order.entity";

export enum UserRole {
    Client      = 'Client',
    Owner       = 'Owner',
    Delivery    = 'Delivery'
}

registerEnumType(UserRole, { name: 'UserRole' })

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column()
    email: string;

    @Field(type => String)
    @Column({ select: false })
    password: string;

    @Field(type => UserRole)
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    profileImg?: string;

    @Field(type => Boolean)
    @Column({ default: false })
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(type => Restaurant, restaurant => restaurant.owner)
    restaurants: Restaurant[]

    @Field(type => [Order])
    @OneToMany(type => Order, order => order.customer)
    orders: Order[]

    @Field(type => [Order])
    @OneToMany(type => Order, order => order.driver)
    carries: Order[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if ( this.password ){
            try { this.password = await bcrypt.hash(this.password, 10) } 
            catch (error) {
                throw new InternalServerErrorException()
            }
        }
    }

    async confirmPassword( aPassword: string ): Promise<boolean> {
        try { return bcrypt.compare(aPassword, this.password) } 
        catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}