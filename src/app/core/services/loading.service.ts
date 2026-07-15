import { Injectable } from '@angular/core';
import { BehaviorSubject, flatMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  private requestCount = 0;
  private loadingStartTime = 0;
  private minDisplayTime = 300;

  constructor() {}

  show() {
    this.requestCount++;

    if (this.requestCount === 1) {
      this.loadingStartTime = Date.now();
      this.loadingSubject.next(true);
    }
  }

  hide() {
    this.requestCount--;

    if (this.requestCount <= 0){
      this.requestCount = 0;

      const elapsedTime = Date.now() - this.loadingStartTime;
      const remainingTime = this.minDisplayTime - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          this.loadingSubject.next(false)
        }, remainingTime)
      } else {
        this.loadingSubject.next(false)
      }
    }
  }
}
