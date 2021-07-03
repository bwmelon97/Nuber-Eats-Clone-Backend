import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Order } from "../entities/order.entity";

@InputType()
export class ChangeOrderStatusInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class ChangeOrderStatusOutput extends CoreOutput {}