import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { CoreEntity } from "src/common/entities/core.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";

enum UserRole {
    Client,
    Owner,
    Delivery
}

registerEnumType(UserRole, { name: 'UserRole' })

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

    @Field(type => Boolean)
    @Column({ default: false })
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(type => Restaurant, restaurant => restaurant.owner)
    restaurants: Restaurant[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if ( this.password ){
            try { this.password = await bcrypt.hash(this.password, 10) } 
            catch (error) {
                console.log(error)
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