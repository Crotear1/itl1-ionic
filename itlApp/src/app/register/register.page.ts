import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RegisterService } from '../register.service.spec';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(
    private alertController: AlertController,
    private registerService: RegisterService // Inject the service here
  ) {}

  async register(form: NgForm) {
    if (form.valid) {
      const response = await this.registerService.register(form.value);
      // console.log(form.value);
      console.log(response);

      // Beispiel für eine Erfolgsmeldung:
      const alert = await this.alertController.create({
        header: 'Erfolgreich!',
        message: 'Du hast dich erfolgreich registriert.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
