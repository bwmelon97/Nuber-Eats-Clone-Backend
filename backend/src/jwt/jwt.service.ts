import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
    constructor( @Inject(CONFIG_OPTIONS) private readonly jwtOptions: JwtOptions ){}

    sign = ( payload: {id: number} ): string => jwt.sign( payload, this.jwtOptions.privateKey )
}
