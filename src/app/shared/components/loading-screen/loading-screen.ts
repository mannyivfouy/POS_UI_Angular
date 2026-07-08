import { AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { LoadingScreenService } from '../../../core/services/loading.service';
import { AsyncPipe } from '@angular/common';

declare var lottie: any;

@Component({
  selector: 'app-loading-screen',
  imports: [AsyncPipe],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css',
})
export class LoadingScreen implements AfterViewInit, OnDestroy {
  loadingService = inject(LoadingScreenService);
  private animation: any;

  ngAfterViewInit(): void {
  this.animation = lottie.loadAnimation({
    container: document.getElementById('loading-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/animations/loading2.json',
  });

  this.loadingService.loading$.subscribe((isLoading) => {
    if (isLoading) {
      this.animation.goToAndPlay(0, true);
    } else {
      this.animation.stop();
    }
  });
}

  ngOnDestroy() {
    if (this.animation) {
      this.animation.destroy();
    }
  }
}
