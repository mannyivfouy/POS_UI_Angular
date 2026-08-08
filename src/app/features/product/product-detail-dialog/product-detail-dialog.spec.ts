import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailDialog } from './product-detail-dialog';

describe('ProductDetailDialog', () => {
  let component: ProductDetailDialog;
  let fixture: ComponentFixture<ProductDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
