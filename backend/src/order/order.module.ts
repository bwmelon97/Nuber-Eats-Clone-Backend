import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantRepository } from 'src/restaurant/repositories/restaurant.repository';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
    imports: [ TypeOrmModule.forFeature([RestaurantRepository, Order]) ],
    providers: [ OrderResolver, OrderService]
})
export class OrderModule {}
