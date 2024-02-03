import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  phoneNumber = '204550762';
  code = '';
  countryJson = environment.countryJson;
  countryPhoneCode = '+36';
  recaptchaInvisible: any;
  recaptchaVisible: any
  smsSent = false;
  recaptcha = true
  userName = ""
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.auth.getUser().subscribe((user) => {
      if (user) this.router.navigate(['home']);
    });
  }

  ngOnInit() {}

  ionViewWillLeave() {
    
  }

  ionViewDidEnter() {
    if(!this.recaptchaInvisible){
    this.recaptchaInvisible = new RecaptchaVerifier(
      getAuth(),
      'recaptchaInvisible',
      {
        size: 'invisible',
        callback: () => {
          this.recaptcha = this.recaptchaInvisible
        },
        'expired-callback': () => {},
      }
    )};

    this.recaptcha = this.recaptchaInvisible

    if(!this.recaptchaVisible){
      this.recaptchaVisible = new RecaptchaVerifier(
        getAuth(),
        'recaptchaVisible',
        {
          size: 'normal',
          callback: () => {
            this.recaptcha = true;
            this.recaptcha = this.recaptchaVisible
          },
          'expired-callback': () => {
            this.recaptcha = false;
          },
        }
      )};
  }

  signInWithPhone() {
    if(this.recaptcha) {
    this.auth
      .signInWithPhone(
        this.countryPhoneCode + this.phoneNumber,
        this.recaptcha, this.userName
      )
      .then((confirmationResult) => {
        // this.smsSent = true;
        this.verification()
        console.log('SMS elküldve', confirmationResult);
      })
      .catch((err) => {
        this.smsSent = false;
        console.log(err);
      })
    };
  }

  verificationCode() {
    this.auth
      .verificationCode(this.code)
      .then(() => {
        console.log('sikeres belépés');
      })
      .catch(() => {
        console.log('Nem megfelelő kódot adtál meg!')
        this.recaptcha = false
        this.recaptchaVisible.render()
      });
  }

  countryCodeChange(event: any) {
    console.log(event);
  }

 async verification() {
    const alert = await this.alertController.create({
      header: "Írd be a megerősítő kódot!",
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Írd be a kapott kódot!'
        }
      ],
      buttons: [
        {
          text: 'Kód megerősítése',
          handler: (res) => {
            this.code = res.code
            this.verificationCode()
          }
        }
      ]
    })
   await alert.present()
  }
}
