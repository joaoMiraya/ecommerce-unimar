import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { type JwtPayload } from '../../domain/auth/types/auth.types';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';

/**
 * JWT Auth Guard
 * Valida o JWT token da requisição e extrai informações do usuário
 * Protege rotas que requerem autenticação
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Adicionar informações do usuário ao contexto da requisição
      request.user = {
        userId: payload.sub,
        email: payload.email,
        tokenType: payload.type,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Extrai token do header Authorization: Bearer <token>
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    return parts[1];
  }
}
