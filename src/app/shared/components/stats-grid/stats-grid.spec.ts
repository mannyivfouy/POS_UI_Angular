import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGrid } from './stats-grid';

describe('StatsGrid', () => {
  let component: StatsGrid;
  let fixture: ComponentFixture<StatsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
