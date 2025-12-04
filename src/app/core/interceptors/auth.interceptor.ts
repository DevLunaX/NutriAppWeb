import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  return from(authService.getSession()).pipe(
    switchMap((session) => {
      if (session?.access_token) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        return next(clonedReq);
      }
      return next(req);
    }),
    catchError(() => {
      return next(req);
    })
  );
};
