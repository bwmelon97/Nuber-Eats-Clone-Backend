import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/example.entity';
import { ExampleResolver } from './example.resolver';
import { ExampleService } from './example.service';

@Module({
    imports: [ TypeOrmModule.forFeature([Restaurant]) ],
    providers: [ExampleResolver, ExampleService]
})
export class ExampleModule {}
