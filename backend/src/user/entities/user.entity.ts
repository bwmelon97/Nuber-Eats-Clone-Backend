import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt";
import { CoreEntity } from "src/common/entities/core.entity";
import { InternalServerErrorException } from "@nestjs/common";

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
    @Column()
    password: string;

    @Field(type => UserRole)
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole

    @BeforeInsert()
    async hashPassword() {
        try { this.password = await bcrypt.hash(this.password, 10) } 
        catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}