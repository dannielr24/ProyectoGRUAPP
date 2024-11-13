import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  helpTopics: { title: string, action: () => void}[];
  selectedHelpTopic: { title: string, content: SafeHtml } | null = null;

  constructor(private location: Location, private router: Router, private sanitizer: DomSanitizer) {
    this.helpTopics = [
      { title: 'Cómo usar la aplicación', action: () => this.showHelp('uso') }, 
      { title: 'Solución de problemas comunes', action: () => this.showHelp('problemas')},
      { title: 'Preguntas frecuentes', action: () => this.showHelp('faq')}
    ];
  }

  sendWhatsAppMessage() {
    const phoneNumber = '953128201';
    const message = encodeURIComponent('Hola, necesito ayuda con la aplicación.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

  showHelp(topic: string) {
    switch (topic) {
      case 'uso':
        this.selectedHelpTopic = {
          title: 'Cómo usar la aplicación',
          content: this.sanitizer.bypassSecurityTrustHtml(`
          <p>Aquí puedes encontrar los pasos para usar la aplicación:</p>
          <h3>Pasos para empezar:</3>
          <ul>
            <li>Regístrate con cualquier dirección de correo electrónico.</li>
            <li>Completa el formulario de registro con tú información personal.</li>
            <li>Verifica tú correo y activa tú cuenta.</li>
            <li>Inicia sesión con tus credenciales.</li>
            <li>Navega por las diferentes secciones de la app, como reservas y perfil.</li>
          </ul>
          <p>Explora todas las funciones para obtener el máximo provecho de la aplicación.</p>
          `),
        };
        break;
      case 'problemas':
        this.selectedHelpTopic = {
          title: 'Solución de problemas comunes',
          content: this.sanitizer.bypassSecurityTrustHtml(`
          <p>Si encuentras errores al usar la aplicación, prueba las siguientes soluciones:</p>
          <h3>Problemas frecuentes y soluciones:</h3>
          <ul>
            <li><strong>Error al iniciar sesión:</strong> Verifica que tu correo y contraseña sean correctos.</li>
            <li><strong>Problemas de conexión:</strong> Asegúrate de estar conectado a internet.</li>
            <li><strong>La aplicación se cierra:</strong> Intenta reiniciar la aplicación o actualizarla.</li>
          </ul>
          <p>Si los problemas persisten, contacta al soporte técnico.</p>
        `),
      };
        break;
      case 'faq':
        this.selectedHelpTopic = {
          title: 'Preguntas frecuentes',
          content: this.sanitizer.bypassSecurityTrustHtml(`
          <p>Aquí respondemos a las preguntas más comunes sobre la app:</p>
          <h3>Preguntas:</h3>
          <ul>
            <li><strong>¿Cómo puedo cambiar mi contraseña?</strong> Ve a la sección de ajustes y selecciona "Cambiar contraseña".</li>
            <li><strong>¿Qué métodos de pago se aceptan?</strong> Aceptamos tarjetas de crédito/débito, transferencias y efectivo.</li>
            <li><strong>¿Dónde encuentro mi historial?</strong> Accede a la sección "Historial" en el menú principal.</li>
          </ul>
        `),
      };
        break;
      default:
        this.selectedHelpTopic = null;
        break;
    }
    console.log('Contenido seleccionado:', this.selectedHelpTopic);
  }


  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
