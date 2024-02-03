import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userSub: Subject<any> = new Subject();
  confirmationResult!: firebase.auth.ConfirmationResult
  userName: any

  constructor(private fireAuth: AngularFireAuth, private router: Router) {
    this.fireAuth.onAuthStateChanged((user) => {
      if(user && this.userName) {
        user.updateProfile(
          {
            displayName: this.userName
          }
        ).then(
          () => {
            this.userSub.next(user); //  hirdeti a usert az értékeivel
          }
        )
      }
      else this.userSub.next(user)   //  hirdeti a usert null értékkel  
    });
  }

  getUser() {
    return this.userSub
  }

  logOut() {
    this.fireAuth.signOut().then(
      () => this.router.navigate(['/sign-in'])
    )
  }

  signInWithPhone(phoneNumber: string, verifier: any, userName: string) {
    this.userName = userName
    return new Promise<any>(
      (res, rej) => {
        this.fireAuth.signInWithPhoneNumber(phoneNumber, verifier)
        .then(
          (confirmationResult) => {
            this.confirmationResult = confirmationResult;
            res(confirmationResult)
          }
        ).catch(
          (err) => {
            const error = new Error("Sms-t nem sikerült elküldeni!")
            rej(error)
          }
        )
      }
    )
  }

  verificationCode(code:any) {
   return this.confirmationResult.confirm(code)
  }


}
