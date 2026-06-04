import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser()
 * Extrai informações do usuário autenticado da requisição
 * Deve ser usado com JwtAuthGuard
 *
 * @example
 * @Get('/profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    return request.user;
  },
);

/**
 * Interface para type-safety do CurrentUser
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  tokenType: 'access' | 'refresh';
}

/**
 * @CurrentUserId()
 * Extrai apenas o ID do usuário autenticado
 *
 * @example
 * @Get('/my-profile')
 * @UseGuards(JwtAuthGuard)
 * getMyProfile(@CurrentUserId() userId: string) {
 *   return this.userService.findById(userId);
 * }
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    return request.user?.userId;
  },
);
