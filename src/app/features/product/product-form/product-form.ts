import { Component } from '@angular/core';
import { SearchableSelect } from "../../../shared/components/searchable-select/searchable-select";

@Component({
  selector: 'app-product-form',
  imports: [SearchableSelect],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {

}
