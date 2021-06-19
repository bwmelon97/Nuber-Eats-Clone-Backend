import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";

@Injectable()
export class OrderService {

    async createOrder (
        client: User, createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        try {
            return { ok: true }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

}