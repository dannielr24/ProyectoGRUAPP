import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  helpTopics: string[];

  constructor(private location: Location) {
    this.helpTopics = [
      'Cómo usar la aplicación',
      'Solución de problemas comunes',
      'Preguntas frecuentes',
      'Contactar soporte'
    ];
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
