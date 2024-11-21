import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private cards = [
    { 
      name: 'Visa', 
      holderName: 'Juan Pérez', 
      number: '**** 1234', 
      expiry: '12/24' 
    },
    { 
      name: 'MasterCard', 
      holderName: 'Ana Gómez', 
      number: '**** 5678', 
      expiry: '11/23' 
    }
  ];

  constructor() { }

  getCards() {
    return this.cards;
  }

  addCard(card: any) {
    this.cards.push(card);
  }

  editCard(card: any) {
    const index = this.cards.findIndex(c => c.number === card.number);
    if (index !== -1) {
      this.cards[index] = card;
    }
  }

  deleteCard(card: any) {
    const index = this.cards.findIndex(c => c.number === card.number);
    if (index !== -1) {
      this.cards.splice(index, 1);
    }
  }
}
