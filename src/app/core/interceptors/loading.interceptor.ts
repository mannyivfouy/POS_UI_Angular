import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingScreenService } from "../services/loading.service";
import { finalize } from "rxjs";


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingScreenService = inject(LoadingScreenService);

  loadingScreenService.show();

  return next(req).pipe(
    finalize(() => {
      loadingScreenService.hide()
    })
  )
}
