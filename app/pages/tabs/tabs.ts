import {Page} from "ionic-angular";
import {WeighInForm} from "../weigh-in-form/WeighInForm";

@Page({
  template: `
  <ion-tabs>
    <ion-tab [root]="tab1Root" tabTitle="Weigh In" tabIcon="body"></ion-tab>
    <ion-tab [root]="tab2Root" tabTitle="Progress" tabIcon="trending-down"></ion-tab>
    <ion-tab [root]="tab3Root" tabTitle="Photos" tabIcon="images"></ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab"s root Page
  tab1Root: any = WeighInForm;
  tab2Root: any = WeighInForm;
  tab3Root: any = WeighInForm;
}
