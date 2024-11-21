import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaAutoPage } from './ruta-auto.page';

describe('RutaAutoPage', () => {
  let component: RutaAutoPage;
  let fixture: ComponentFixture<RutaAutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaAutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
