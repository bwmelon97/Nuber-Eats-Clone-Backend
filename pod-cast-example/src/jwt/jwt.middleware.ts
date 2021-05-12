import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { X_JWT } from "./jwt.constants";
import { JwtService } from "./jwt.service";


@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor( 
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,    
    ) {}

    async use( req: Request, res: Response, next: NextFunction ) {
        if ( X_JWT in req.headers ) {
            const token = req.headers[X_JWT];
            try {
                const decoded = this.jwtService.verify( token.toString() )
                if ( typeof decoded === 'object' && decoded.hasOwnProperty('id') ){
                    const { ok, user } = await this.usersService.findUserById(decoded['id']);
                    if ( !ok ) throw Error;
                    req['user'] = user;
                }
            } catch (error) { return error; }
        }
        next();
    }
}