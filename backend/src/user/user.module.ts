import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Verification]) ],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}
