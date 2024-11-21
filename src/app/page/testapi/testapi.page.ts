import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-testapi',
  templateUrl: './testapi.page.html',
  styleUrls: ['./testapi.page.scss'],
})
export class TestapiPage implements OnInit {

  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getDataFromApi();
  }

  getDataFromApi() {
    const userData = {
      p_correo: 'tu_correo@example.com', 
      token: 'tu_token' 
    };

    this.apiService.obtenerUsuario(userData) 
    .then(response => {
      this.data = response;
      console.log('Data from API:', this.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }
}

