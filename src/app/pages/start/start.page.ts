import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  cards: any[] = [];
  coupons = [];
  totalBalance = 0;
  agriAppData = [];
  lastUpdate = 0;
  greeting = "Guten Tag!";

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private dataService: DataService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

      var now     = new Date(); 
      var hour    = now.getHours(); 
     if(hour <= 10){  
        this.greeting = "Guten Morgen!";
     } else if (hour <= 16 && hour >= 11) {
       this.greeting = "Guten Tag!";
     } else if (hour >= 17) {
       this.greeting = "Guten Abend!";
     }


     else {
           document.getElementById('display').innerHTML = "good morning";
      }
  


    if (localStorage.getItem("agriCredits") !== null) {
      this.cards = JSON.parse(localStorage.getItem("agriCredits"));
      this.coupons = JSON.parse(localStorage.getItem("agriCoupons"));
      this.lastUpdate = parseInt(localStorage.getItem('lastUpdate'));
      console.log(this.lastUpdate);
    }
  }

  ionViewWillEnter() {
    this.cards = [];
    this.totalBalance = 0;
    if (localStorage.getItem("agriCredits") !== null) {
      this.cards = JSON.parse(localStorage.getItem("agriCredits"));
      this.coupons = JSON.parse(localStorage.getItem("agriCoupons"));
      this.cards.forEach(card => {
        this.totalBalance += parseFloat(card.balance);
      });
    }
  }

  async addCard() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Guthabenkarte hinzufügen",
      message:
        "Gib die Kartennummer deiner Agrola Guthabenkarte ein sowie eine Beschreibung, damit Du diese wiedererkennst.",
      inputs: [
        {
          name: "description",
          type: "text",
          placeholder: "Beschreibung",
          min: 5,
          max: 50,
        },
        {
          name: "cardNo",
          type: "number",
          placeholder: "Kartennummer",
          min: 19,
          max: 19,
        },
      ],
      buttons: [
        {
          text: "Abbruch",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Cancel");
          },
        },
        {
          text: "Speichern",
          handler: (e) => {
            var returnValue = false;
            if (e.description.length > 5) {
              returnValue = true;
            }

            if (e.cardNo.length == 19) {
              returnValue = true;
            }

            if (returnValue) {
              this.fetchCredit(e.description, e.cardNo.toString());
            }
            return returnValue;
          },
        },
      ],
    });

    await alert.present();
  }

  async addCoupon() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Coupon hinzufügen",
      message:
        "Gib die Coupon-Nummer unterhalb des Barcodes auf dem Coupon ein. Gib zudem eine Beschreibung ein, damit Du diesen wiedererkennst. Gib zudem das Ablaufdatum ein.",
      inputs: [
        {
          name: "description",
          type: "text",
          placeholder: "Beschreibung",
          min: 5,
          max: 50,
        },
        {
          name: "discount",
          type: "text",
          placeholder: "Rabattierung in % oder Rappen"
        },
        {
          name: "couponNo",
          type: "number",
          placeholder: "Couponnummer"
        },
        {
          name: "validThru",
          type: "date"
        }
      ],
      buttons: [
        {
          text: "Abbruch",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Cancel");
          },
        },
        {
          text: "Speichern",
          handler: (e) => {
            var returnValue = false;
            if (e.description.length > 5) {
              returnValue = true;
            } else {
              returnValue = false;
            }

            if (e.discount.length > 1) {
              returnValue = true;
            } else {
              returnValue = false;
            }

            if (e.couponNo.length > 1) {
              returnValue = true;
            } else {
              returnValue = false;
            }

            if (e.validThru.length > 9) {
              returnValue = true;
            } else {
              returnValue = false;
            }

            if (returnValue) {
              this.addCouponToSet(e.description, e.discount, e.couponNo.toString(), e.validThru.toString());
            }
            return returnValue;
          },
        },
      ],
    });

    await alert.present();
  }

  addCouponToSet(description, discount, cardNo, validThru) {
    var unixTimeStamp = new Date(validThru).getTime();
    this.dataService.imageURLtoBase64('https://bwipjs-api.metafloor.com/?bcid=code128&text=' + cardNo)
    .then(
      result => {
        this.coupons.push({
          description: description,
          discount: discount,
          barcode: result.toString(),
          couponNumber: cardNo,
          validThru: unixTimeStamp,
          showBarCode: false
        });
        this.preserveData();
      }
    )
    .catch(err => this.notificationService.alertWithOK('Fehler', '', err));
  }


  async fetchCredit(description, cardNo) {
    (await this.dataService.getCardData(cardNo)).subscribe((data) => {
      if (data["ErrorMessage"] == "Der Saldo konnte nicht geprüft werden.") {
        this.notificationService.alertWithOK(
          "Hoppla!",
          "Karte wurde nicht gefunden",
          "Die Geschenkkarte konnte nicht gefunden werden. Versuche es nochmals und prüfe nochmals, ob die Kartennummer stimmt. <br><br>Es ist auch möglich, dass die Karte verfallen oder bereits nicht mehr gültig ist."
        );
      } else if (data["ErrorMessage"] == "" && data["Currency"] !== null) {
        this.addCardToSet(description, cardNo, data);
        this.notificationService.simpleToast(
          "Die Guthabenkarte wurde deiner Sammlung hinzugefügt.",
          3000
        );
        this.doRefresh(null);
      }
    });
  }

  addCardToSet(description, cardNo, dataSet) {
    this.dataService.imageURLtoBase64('https://bwipjs-api.metafloor.com/?bcid=code128&text=' + cardNo)
    .then(
      result => {
        this.cards.push({
          description: description,
          barcode: result.toString(),
          cardNumber: cardNo,
          balance: dataSet.Balance,
          ExpirationDate: dataSet.ExpirationDate,
          Success: dataSet.Success,
          ToasterTitle: dataSet.ToasterTitle,
          ToasterText: dataSet.ToasterText,
          ToasterFooter: dataSet.ToasterFooter,
          ToasterLink: dataSet.ToasterLink,
          ErrorMessage: dataSet.ErrorMessage,
          ToasterType: dataSet.ToasterType,
          Id: dataSet.Id,
          ReturnValues: dataSet.ReturnValues,
          showCardInfo: true
        });
        this.preserveData();
        this.doRefresh(null);
      }
    )
    .catch(err => this.notificationService.alertWithOK('Fehler', '', err));

  }

  preserveData() {
    localStorage.setItem("agriCredits", JSON.stringify(this.cards));
    localStorage.setItem("agriCoupons", JSON.stringify(this.coupons));
 }


  showCardOptions(cardIndex) {
    if(this.cards[cardIndex].showCardInfo) {
      this.cards[cardIndex].showCardInfo = false;
    } else {
      this.cards[cardIndex].showCardInfo = true;
    }
  }

  showCouponOptions(couponIndex) {
    if(this.coupons[couponIndex].showBarcode) {
      this.coupons[couponIndex].showBarcode = false;
    } else {
      this.coupons[couponIndex].showBarcode = true;
    }
  }

  doRefresh(event) {
    if(this.cards.length == 0) {
      this.notificationService.simpleToast('Füge deine erste Karte hinzu. Tippe auf das +', 2000);
      event.target.complete();
    } else {
      
      this.totalBalance = 0;

      this.cards.forEach(async (item, index) => {
        (await this.dataService.getCardData(item.cardNumber)).subscribe((dataSet) => {
          if(dataSet["ErrorMessage"] !== "Der Saldo konnte nicht geprüft werden.") {
            (this.cards[index].balance = dataSet["Balance"]),
            (this.cards[index].validThru = dataSet["ExpirationDate"]),
            (this.cards[index].Success = dataSet["Success"]),
            (this.cards[index].ErrorMessage = dataSet["ErrorMessage"]);

            this.totalBalance += this.cards[index].balance;
            this.preserveData();
            
            if (index + 1 == this.cards.length) {
              this.lastUpdate = Date.now();
              localStorage.setItem('lastUpdate', this.lastUpdate.toString() )

              if(event !== null) {
                event.target.complete();
              }
            }
          } else {        
            this.notificationService.alertWithOK(
              "Hoppla!",
              "Karte wurde nicht gefunden",
              "Die Geschenkkarte mit der Nummer " + item.cardNumber + "konnte nicht gefunden werden. Versuche es nochmals und prüfe nochmals, ob die Kartennummer stimmt. <br><br>Es ist auch möglich, dass die Karte verfallen oder bereits nicht mehr gültig ist."
              );
            }
          });
          
        });
      }
    }

}
