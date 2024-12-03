import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoVehiculosPage } from './listado-vehiculos.page';

describe('ListadoVehiculosPage', () => {
  let component: ListadoVehiculosPage;
  let fixture: ComponentFixture<ListadoVehiculosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoVehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
