import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistory } from './purchase-history';

describe('PurchaseHistory', () => {
  let component: PurchaseHistory;
  let fixture: ComponentFixture<PurchaseHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
