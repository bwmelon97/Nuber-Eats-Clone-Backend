import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { AllowedRole } from "./role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private readonly reflector: Reflector ) {}
    
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<AllowedRole>(
            'roles',
            context.getHandler()
        )
        if( !roles ) return true;

        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user: User = gqlContext['user']
        if (!user) return false;

        return roles.includes('Any') || roles.includes(user.role);
    }
}