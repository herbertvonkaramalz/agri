import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private httpClient: HttpClient
  ) { }

  async getCardData(cardNo) {
    //example cardno:  6279236140250710039
    return this.httpClient.get<any[]>("https://privaterelay-corsanywhere.herokuapp.com/https://www.landi.ch/api/de/giftcard/balance/" + cardNo);
  }

  async imageURLtoBase64(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
}
