import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateRestaurantDTO {
    @Field(is => String)
    name: string

    @Field(is => String)
    address: string
    
    @Field(is => String)
    ownerName: string
    
    @Field(is => Boolean)
    isVegan: boolean
}