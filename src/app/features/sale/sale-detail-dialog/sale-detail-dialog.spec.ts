import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailDialog } from './sale-detail-dialog';

describe('SaleDetailDialog', () => {
  let component: SaleDetailDialog;
  let fixture: ComponentFixture<SaleDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
