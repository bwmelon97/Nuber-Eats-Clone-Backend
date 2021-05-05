import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/example.entity';

@Injectable()
export class ExampleService {

    constructor( 
        @InjectRepository(Restaurant)
        private readonly repository: Repository<Restaurant>    
    ) {}

    getAll(): Promise<Restaurant[]> {
        return this.repository.find()
    }
}
