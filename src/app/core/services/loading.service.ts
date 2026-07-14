import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  private requestCount = 0;

  constructor() {}

  show() {
    this.requestCount++;

    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    this.requestCount--;

    if (this.requestCount <= 0){
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }
}
