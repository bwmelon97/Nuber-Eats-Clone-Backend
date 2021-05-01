import { Module } from '@nestjs/common';
import { ExampleResolver } from './example.resolver';

@Module({
    providers: [ExampleResolver]
})
export class ExampleModule {}
