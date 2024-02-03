import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  messages: any
  newMessage: any
  userName = 'Istvan'

  constructor(private base: BaseService) {
    this.base.getMessages().snapshotChanges().pipe(
      map(
        changes => changes.map(
          (c) => ({key:c.payload.key, ...c.payload.val()})
        )
      )
    ).subscribe(
      (messages) => this.messages = messages
    )
  }

  addMessage() {
    if(this.newMessage) {
      let time = new Date().toLocaleTimeString()
      let body = {
        user: this.userName,
        time: time,
        message: this.newMessage
      }
      this.base.addMessage(body);
      this.newMessage = ''
    }

  }

  updateMessage(message: any) {
    this.base.updateMessage(message)
  }

  deleteMessage(message: any) {
    this.base.deleteMessage(message)
  }

}
