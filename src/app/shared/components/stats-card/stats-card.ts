import { Component, Input } from '@angular/core';
import { StatsCardModel } from '../../models/stats-card.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingDown, TrendingUp, Minus } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, LucideAngularModule, TranslatePipe],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  @Input() data!: StatsCardModel;

  getTrendIcon(direction?: string) {
    switch (direction) {
      case 'up':
        return TrendingUp;

      case 'down':
        return TrendingDown;

      default:
        return Minus;
    }
  }

  get formattedValue(): string {
  if (!this.data) return '';

  switch (this.data.format) {
    case 'currency':
      return `$${this.data.value.toLocaleString()}`;
      // or: return `៛${this.data.value.toLocaleString()}`;

    case 'percent':
      return `${this.data.value}%`;

    case 'number':
    default:
      return this.data.value.toLocaleString();
  }
}
}
