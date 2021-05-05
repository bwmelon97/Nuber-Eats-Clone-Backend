import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Episode {
    @Field( type => Number )
    id: number;     // Episode ID
    
    @Field( type => Number )
    pid: number;     // Parrent(PodCats) ID
    
    @Field( type => String )
    title: string;
    
    @Field( type => String )
    category: string;
    
    @Field( type => Number )
    rating: number;
}