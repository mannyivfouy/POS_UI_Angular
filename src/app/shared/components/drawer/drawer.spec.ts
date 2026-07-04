import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drawer } from './drawer';

describe('Drawer', () => {
  let component: Drawer;
  let fixture: ComponentFixture<Drawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Drawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
