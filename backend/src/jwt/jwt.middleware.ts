import { Inject, Injectable, InternalServerErrorException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UserService } from "src/user/user.service";
import { CONFIG_OPTIONS, X_JWT } from "./jwt.constants";
import { JwtOptions } from "./jwt.interfaces";


export class JwtMiddleware implements NestMiddleware {
    constructor( 
        @Inject(CONFIG_OPTIONS) private readonly options: JwtOptions,
        private readonly userSerivce: UserService    
    ) {}
    
    async use( req: Request, res: Response, next: NextFunction ) {
        if (X_JWT in req.headers) {
            const token = req.headers[X_JWT] 
            try {
                const decoded = jwt.verify( token.toString(), this.options.privateKey )  
                if ( typeof decoded === 'object' && decoded.hasOwnProperty('id') ) {
                    const { ok, user } = await this.userSerivce.findUserByID(decoded['id'])
                    if ( !ok ) throw Error;
                    req['user'] = user;
                }
            } catch (error) { }
        }
        
        next()
    }
}