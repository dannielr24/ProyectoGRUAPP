import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarGruaPage } from './solicitar-grua.page';

describe('SolicitarGruaPage', () => {
  let component: SolicitarGruaPage;
  let fixture: ComponentFixture<SolicitarGruaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarGruaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
