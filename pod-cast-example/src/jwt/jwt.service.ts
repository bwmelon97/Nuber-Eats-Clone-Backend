import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_OPTIONS } from './jwt.constants';
import { JwtOptions } from './jwt.interfaces';


@Injectable()
export class JwtService {
    constructor( 
        @Inject(JWT_OPTIONS) private readonly options: JwtOptions
    ) {}

    sign    = ( payload: any )  => jwt.sign(payload, this.options.privateKey)
    verify  = ( token: string ) => jwt.verify(token, this.options.privateKey)
}
