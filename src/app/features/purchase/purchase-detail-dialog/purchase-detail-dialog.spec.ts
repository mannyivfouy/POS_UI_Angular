import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDetailDialog } from './purchase-detail-dialog';

describe('PurchaseDetailDialog', () => {
  let component: PurchaseDetailDialog;
  let fixture: ComponentFixture<PurchaseDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
