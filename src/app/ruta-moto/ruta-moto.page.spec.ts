import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaMotoPage } from './ruta-moto.page';

describe('RutaMotoPage', () => {
  let component: RutaMotoPage;
  let fixture: ComponentFixture<RutaMotoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaMotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
