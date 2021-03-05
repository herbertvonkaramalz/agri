import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  cards: any[] = [];
  coupons: any[] = [];

  constructor(
    private alertController: AlertController,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (localStorage.getItem("agriCredits") !== null) {
      this.cards = JSON.parse(localStorage.getItem("agriCredits"));
    }

    if (localStorage.getItem("agriCoupons") !== null) {
      this.coupons = JSON.parse(localStorage.getItem("agriCoupons"));
    }

    console.log(this.cards.length);
    console.log(this.coupons.length)
  }

  async deleteCard(i) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Achtung!',
        subHeader: 'Die Karte wird unwiderruflich aus der Sammlung gelöscht! Dieser Schritt kann nicht Rückgängig gemacht werden!',
        message: '',
        buttons: [{
          text: 'Abbruch',
          handler: () => {
            this.notificationService.simpleToast('Aktion abgebrochen.', 500);
            alert.dismiss();
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.cards.splice(i, 1);
            this.notificationService.simpleToast('Karte wurde entfernt.', 500);
            localStorage.setItem('agriCredits', JSON.stringify(this.cards))
            alert.dismiss();
          }
        }]
      });
  
      await alert.present();
  }


  
  async deleteCoupon(i) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung!',
      subHeader: 'Die Karte wird unwiderruflich aus der Sammlung gelöscht! Dieser Schritt kann nicht Rückgängig gemacht werden!',
      message: '',
      buttons: [{
        text: 'Abbruch',
        handler: () => {
          this.notificationService.simpleToast('Aktion abgebrochen.', 500);
          alert.dismiss();
        }
      }, {
        text: 'Okay',
        handler: () => {
          this.coupons.splice(i, 1);
          this.notificationService.simpleToast('Karte wurde entfernt.', 500);
          localStorage.setItem('agriCoupons', JSON.stringify(this.cards))
          alert.dismiss();
        }
      }]
    });

    await alert.present();
}

ionViewWillEnter() {
  this.cards = [];
  this.coupons = [];
  if (localStorage.getItem("agriCredits") !== null) {
    this.cards = JSON.parse(localStorage.getItem("agriCredits"));
    this.coupons = JSON.parse(localStorage.getItem("agriCoupons"));
  }
}
  async clearStorage() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung!',
      subHeader: 'Die Daten werden unwiderruflich gelöscht! Dieser Schritt kann nicht Rückgängig gemacht werden!',
      message: '',
      buttons: [{
        text: 'Abbruch',
        handler: () => {
          this.notificationService.simpleToast('Aktion abgebrochen.', 500);
          alert.dismiss();
        }
      }, {
        text: 'Okay',
        handler: () => {
          localStorage.clear();
          this.notificationService.simpleToast('Speicher gelöscht. Starte die App bitte erneut, damit wirklich alle Daten weg sind.', 1500);
          alert.dismiss();
        }
      }]
    });

    await alert.present();
  }

}
