import { InputType, OmitType } from "@nestjs/graphql";
import { Restaurant } from "../entities/example.entity";

@InputType()
export class CreateRestaurantDTO extends OmitType(
    Restaurant, 
    ['id'], 
    InputType
) {}