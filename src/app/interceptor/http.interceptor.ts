import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { throwError, catchError } from 'rxjs'

import { AuthService } from '@@services/auth.service'
import { environment } from '@@environments/environment'
import { LocalStorageService } from '@@services/local-storage.service'

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService)
  const authService = inject(AuthService)
  const router = inject(Router)
  const token = localStorageService.get(`${environment.appName}_token`)

  req = req.clone({
    url: `${environment.apiUrl}/${req.url}`,
    setHeaders: {
      Authorization: token ? `Bearer ${JSON.parse(token)}` : '',
    },
  })

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status > 400 && error.status < 405) {
        authService.signOut()
        router.navigateByUrl('/auth/sign-in')
        return throwError(() => error)
      }

      return throwError(() => error)
    }),
  )
}
