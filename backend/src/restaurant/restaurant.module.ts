import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { DishResolver, RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantRepository, CategoryRepository, Dish])],
  providers: [RestaurantResolver, RestaurantService, DishResolver]
})
export class RestaurantModule {}
