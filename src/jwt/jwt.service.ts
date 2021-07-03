import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
    constructor( @Inject(CONFIG_OPTIONS) private readonly jwtOptions: JwtOptions ){}

    sign = ( payload: {id: number} ): string => 
        jwt.sign( payload, this.jwtOptions.privateKey )
    
    verify = ( token: string ): string | object => 
        jwt.verify( token, this.jwtOptions.privateKey )
}
