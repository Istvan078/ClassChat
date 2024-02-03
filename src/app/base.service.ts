import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  uzenetek: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.uzenetek = db.list('/uzenetek');
  }

  getMessages() {
    return this.uzenetek
  }

  addMessage(body:any) {
    this.uzenetek.push(body)
  }
  
  updateMessage(body:any) {
    this.uzenetek.update(body.key, body)
  }

  deleteMessage(body:any) {
    this.uzenetek.remove(body.key)
  }
  
}
