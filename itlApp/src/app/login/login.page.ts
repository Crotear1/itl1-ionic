import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../login.service.spec';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private alertController: AlertController,
    private loginService: LoginService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    if (form.valid) {
      const response = await this.loginService.login(form.value);
      // console.log(form.value);
      console.log(response);

      // set the token in the local storage
      localStorage.setItem('token', response.token);

      const alert = await this.alertController.create({
        header: 'Erfolgreich!',
        message: 'Du hast dich erfolgreich eingeloggt.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/home']);
    }
  }
}
