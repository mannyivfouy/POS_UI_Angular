import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ChevronDown } from 'lucide-angular';
import { Supplier } from '../../../core/models/supplier.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-purchase-form',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.css',
})
export class PurchaseForm {
  icons = {
    ChevronDown,
  };

  suppliers: Supplier[] = []
  products: Product[] = [];
  
}
