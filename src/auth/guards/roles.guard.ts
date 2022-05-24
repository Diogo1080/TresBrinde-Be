import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from "../../decorators/roles.decorator";
import {UserRole} from "../../user/userRole.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!Boolean(requiredRoles?.length)) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        if (!user) {
            return true;
        }
        return requiredRoles.some((role) => user.role?.includes(role));
    }
}