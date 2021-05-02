import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsString, Length,  } from "class-validator";

@ArgsType()
export class CreateRestaurantDTO {
    @Field(is => String)
    @IsString()
    @Length(0, 10)
    name: string;

    @Field(is => String)
    @IsString()
    address: string
    
    @Field(is => String)
    @IsString()
    ownerName: string
    
    @Field(is => Boolean)
    @IsBoolean()
    isVegan: boolean
}