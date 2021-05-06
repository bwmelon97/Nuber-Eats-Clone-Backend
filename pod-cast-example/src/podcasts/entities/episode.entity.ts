import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({ isAbstract: true, description: 'EpisodeInput' })
@ObjectType()
@Entity()
export class Episode {
    @Field( type => Number )
    @PrimaryGeneratedColumn()
    id: number;     // Episode ID
    
    // @Field( type => Number )
    // @Column()
    // pid: number;     // Parrent(PodCats) ID
    
    @Field( type => String )
    @Column()
    title: string;
    
    @Field( type => String )
    @Column()
    category: string;
    
    @Field( type => Number )
    @Column()
    rating: number;
}