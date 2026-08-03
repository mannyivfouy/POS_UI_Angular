import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleHistory } from './sale-history';

describe('SaleHistory', () => {
  let component: SaleHistory;
  let fixture: ComponentFixture<SaleHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
