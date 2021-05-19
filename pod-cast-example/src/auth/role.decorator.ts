import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";

export type AllowedRole = keyof typeof UserRole | "Any"
export const Role = ( roles: AllowedRole[] ) => SetMetadata( 'roles', roles );