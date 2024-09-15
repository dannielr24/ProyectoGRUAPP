import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReristerPage } from './register.page';

describe('ReristerPage', () => {
  let component: ReristerPage;
  let fixture: ComponentFixture<ReristerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReristerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
