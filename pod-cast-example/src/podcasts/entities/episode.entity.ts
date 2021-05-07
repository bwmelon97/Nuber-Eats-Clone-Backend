import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Podcast } from "./podcast.entity";

@InputType({ isAbstract: true, description: 'EpisodeInput' })
@ObjectType()
@Entity()
export class Episode {
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
    
    @Field( type => Podcast )
    @ManyToOne( type => Podcast, podcast => podcast.episodes, { onDelete: 'CASCADE' } )
    podcast: Podcast;
}