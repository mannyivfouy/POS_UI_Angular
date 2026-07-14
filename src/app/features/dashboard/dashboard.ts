import { Component } from '@angular/core';
import { LoadingScreenService } from '../../core/services/loading.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private loadingScreenService: LoadingScreenService){}
}
