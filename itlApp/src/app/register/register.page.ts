import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RegisterService } from '../register.service.spec';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(
    private alertController: AlertController,
    private registerService: RegisterService,
    private router: Router
  ) {}

  async register(form: NgForm) {
    if (form.valid) {
      const response = await this.registerService.register(form.value);
      // console.log(form.value);
      console.log(response);

      if (response.error) {
        const alert = await this.alertController.create({
          header: 'Fehler!',
          message: 'Die Registrierung war nicht erfolgreich.',
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Erfolgreich!',
          message: 'Du hast dich erfolgreich registriert.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']);
      }
    }
  }
}
