import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Review } from "src/podcasts/entities/review.entity";
import { Podcast } from "src/podcasts/entities/podcast.entity";

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

    // @Field(type => [Podcast])
    // @OneToMany(type => Podcast, podcast => podcast.host)
    // podcasts: Podcast[]

    @Field(type => [Review])
    @OneToMany(
        type => Review,
        review => review.writer
    )
    reviews: Review[]

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