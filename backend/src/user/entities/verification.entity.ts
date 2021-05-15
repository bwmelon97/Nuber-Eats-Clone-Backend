import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { v4 } from "uuid";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    @Field(type => String)
    @Column()
    code: string;

    @Field(type => User)
    @OneToOne(type => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User

    @BeforeInsert()
    generateCode() { this.code = v4() }
}