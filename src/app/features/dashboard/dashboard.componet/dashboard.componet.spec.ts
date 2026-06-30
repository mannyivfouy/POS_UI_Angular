import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponet } from './dashboard.componet';

describe('DashboardComponet', () => {
  let component: DashboardComponet;
  let fixture: ComponentFixture<DashboardComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
