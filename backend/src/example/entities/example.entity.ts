import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Restaurant {
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;
    
    @Field(type => String)
    @Column()
    @IsString()
    @Length(0, 10)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownerName: string;

    @Field(type => Boolean, { defaultValue: false })
    @Column()
    @IsBoolean()
    isVeganOnly: Boolean;
}