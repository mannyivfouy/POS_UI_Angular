import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCart } from './sale-cart';

describe('SaleCart', () => {
  let component: SaleCart;
  let fixture: ComponentFixture<SaleCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
