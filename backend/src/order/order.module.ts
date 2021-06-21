import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { RestaurantRepository } from 'src/restaurant/repositories/restaurant.repository';
import { OrderItem } from './entities/order-item.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';

@Module({
    imports: [ TypeOrmModule.forFeature([RestaurantRepository, OrderRepository, Dish, OrderItem]) ],
    providers: [ OrderResolver, OrderService]
})
export class OrderModule {}
