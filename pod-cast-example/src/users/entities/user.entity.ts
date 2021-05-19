import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt';

export enum UserRole {
    Host        = 'Host',
    Listener    = 'Listener'
}
registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column()
    email: string;

    @Field(type => String)
    @Column( {select: false} )
    password: string;

    @Field(type => UserRole)
    @Column({ type: 'simple-enum', enum: UserRole })
    role: UserRole

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if( this.password ) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    confirmPassword(aPassword: string): Promise<boolean> {
        return bcrypt.compare(aPassword, this.password)
    }
}