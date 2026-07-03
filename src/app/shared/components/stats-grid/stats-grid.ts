import { Component, Input } from '@angular/core';
import { StatsCardModel } from '../../models/stats-card.model';
import { StatsCard } from "../stats-card/stats-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-grid',
  imports: [StatsCard, CommonModule],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
})
export class StatsGrid {
  @Input() stats: StatsCardModel[] = []
}
