import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtService {
    sign    = ( payload: any )  => jwt.sign(payload, process.env.PRIVATE_KEY)
    verify ( token: string ) {
        try { return jwt.verify(token, process.env.PRIVATE_KEY) } 
        catch (e) { }
    }
}
