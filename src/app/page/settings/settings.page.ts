import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  notificationsEnabled: boolean = false;
  darkModeEnabled: boolean = false;

  constructor(private location: Location) {
    this.loadSettings(); 
  }

  ngOnInit(): void {
    this.loadSettings();
    this.applyDarkMode(); 
  }

  loadSettings() {
    const notifications = localStorage.getItem('notificationsEnabled');
    const darkMode = localStorage.getItem('darkModeEnabled');

    if (notifications !== null) {
      this.notificationsEnabled = JSON.parse(notifications);
    }

    if (darkMode !== null) {
      this.darkModeEnabled = JSON.parse(darkMode);
    }
  }

  saveNotifications() {
    localStorage.setItem('notificationsEnabled', JSON.stringify(this.notificationsEnabled));
    console.log('Notificaciones guardadas:', this.notificationsEnabled);
  }

  saveDarkMode() {
    localStorage.setItem('darkModeEnabled', JSON.stringify(this.darkModeEnabled));
    console.log('Modo oscuro guardado:', this.darkModeEnabled);
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    this.applyDarkMode(); 
    this.saveDarkMode(); 
  }

  applyDarkMode() {
    if (this.darkModeEnabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  saveSettings() {
    this.saveNotifications();
    this.saveDarkMode();
  }

  goBack() {
    this.location.back();
  }
}
