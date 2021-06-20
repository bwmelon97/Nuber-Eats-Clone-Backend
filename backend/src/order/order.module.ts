import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { RestaurantRepository } from 'src/restaurant/repositories/restaurant.repository';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
    imports: [ TypeOrmModule.forFeature([RestaurantRepository, Order, Dish, OrderItem]) ],
    providers: [ OrderResolver, OrderService]
})
export class OrderModule {}
