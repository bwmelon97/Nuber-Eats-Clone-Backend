import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Episode } from "./episode.entity";

@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
    @Field( type => Number )
    @PrimaryGeneratedColumn()
    id: number;

    @Field( type => String )
    @Column()
    title: string;

    @Field( type => String )
    @Column()
    category: string;

    @Field( type => Number )
    @Column()
    rating: number;

    @Field( type => [Episode] )
    @OneToMany( type => Episode, entity => entity.podcast )
    episodes: Episode[];
}