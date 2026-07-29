import { LucideIconData } from 'lucide-angular';

export interface TrendModel {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  label: string;
}

export interface StatsCardModel {
  titleKey: string;
  value: number | string;
  icon: LucideIconData;
  trend?: TrendModel;
  iconColor?: "indigo" | "green" | "red" | "orange";
  
}
