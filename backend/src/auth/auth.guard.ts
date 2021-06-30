import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "src/jwt/jwt.service";
import { UserService } from "src/user/user.service";
import { AllowedRole } from "./role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( 
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,    
        private readonly userService: UserService
    ) {}
    
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const roles = this.reflector.get<AllowedRole>(
            'roles',
            context.getHandler()
        )
        if( !roles ) return true;

        const graphqlContext = GqlExecutionContext.create(context).getContext()
        const token: string = graphqlContext['token']
        if( !token ) return false;

        try {
            const decoded = this.jwtService.verify( token.toString() )  
            if ( typeof decoded === 'object' && decoded.hasOwnProperty('id') ) {
                const { ok, user } = await this.userService.findUserByID(decoded['id'])
                if ( !ok ) throw Error;
                if ( user ) {
                    graphqlContext['user'] = user;
                    return roles.includes('Any') || roles.includes(graphqlContext.user.role)
                }
                return false;
            }
        } catch (error) { return false }
    }
}