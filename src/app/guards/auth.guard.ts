import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthService } from '@@services/auth.service'

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.getIsAutheticate) {
    return router.createUrlTree(['/auth/sign-in'])
  }

  return authService.getIsAutheticate
}
