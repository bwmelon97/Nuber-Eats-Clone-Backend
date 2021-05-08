import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
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

    /* 현재 이메일만 업데이트해도 비밀번호를 알아먹을 수 없도록 변경됨..
       추후에 수정할 예정
    */
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        try { this.password = await bcrypt.hash(this.password, 10) } 
        catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
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