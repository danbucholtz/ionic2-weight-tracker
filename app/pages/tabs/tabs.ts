import {Component, ViewChild} from "@angular/core";

import {Events, App} from "ionic-angular";
import {PhotoList} from "../photo-list/PhotoList";
import {ProgressView} from "../progress-view/ProgressView";
import {WeighInForm} from "../weigh-in-form/WeighInForm";

@Component({
  template: `
  <ion-tabs #tabs>
    <ion-tab [root]="tab1Root" tabTitle="Weigh In" tabIcon="body"></ion-tab>
    <ion-tab [root]="tab2Root" tabTitle="Progress" tabIcon="trending-down"></ion-tab>
    <ion-tab [root]="tab3Root" tabTitle="Photos" tabIcon="images"></ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {
  tab1Root: any = WeighInForm;
  tab2Root: any = ProgressView;
  tab3Root: any = PhotoList;

  constructor(private eventDispatcher:Events, private app:App){
      this.eventDispatcher = eventDispatcher;
      this.app = app;
  }

  onPageDidEnter(){
     this.eventDispatcher.subscribe("weighInComplete", () => {
         //this.getTabs().select(1);
     });
  }

  getTabs(){
      return this.app.getComponent("tabs");
  }
}
