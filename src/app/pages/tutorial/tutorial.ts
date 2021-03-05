import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, IonSlides } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-tutorial",
  templateUrl: "tutorial.html",
  styleUrls: ["./tutorial.scss"],
})
export class TutorialPage {
  // Get Slides from the HTML-Code and initiate it as 'slides' from type IonSlides.
  @ViewChild("slides", { static: true }) slides: IonSlides;

  constructor(
    private router: Router,
    private storage: Storage,
  ) { }

  /**
  * @ngdoc function
  * @name ngOnInit
  * @methodOf tutorial.ts
  * @description This method will always be called on init of the Page
  * @private
  */
  ngOnInit() {
    // Disable swipe-gestures for the Tutorial-Slides
    this.slides.lockSwipes(true);

    /* Check if user already did the Tutorial. If yes, redirect 
    to the App-Section using Angular-Router */
    this.storage.get("user_did_tutorial").then((res) => {
      if (res === true) {
        this.router.navigateByUrl("/app/tabs/start", { replaceUrl: true });
      }
    });
  }

  /**
  * @ngdoc function
  * @name finishTutorial
  * @methodOf tutorial.ts
  * @description This method will be called as soon as the user taps on 
  *              the latest button inside the tutorial slides of the tutorial-Page.
  *              The method redirects the user to the "normal" App-Section using 
  *              Angular-Routing and creates a 'user_did_tutorial'-Variable with 
  *              the Value true to the Application-Storage.
  * @private
  */
  finishTutorial() {
    this.router
      .navigateByUrl("/app/tabs/start", { replaceUrl: true })
      .then(() => this.storage.set("user_did_tutorial", true));
  }

 /**
  * @ngdoc function
  * @name nextSlide
  * @methodOf tutorial.ts
  * @description This method will always be called if the user uses a "Next"-Button
  *              inside the Tutorial-Slides.  It unlocks the slides, goes to the next 
  *              one and locks them again. The method can also be called from another
  *              method inside this component.
  * @private
  */
  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }
}
