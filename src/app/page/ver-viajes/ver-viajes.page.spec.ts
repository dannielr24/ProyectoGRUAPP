import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerViajesPage } from './ver-viajes.page';

describe('VerViajesPage', () => {
  let component: VerViajesPage;
  let fixture: ComponentFixture<VerViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
