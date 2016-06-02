import "es6-shim";
import {Component} from "@angular/core";
import {Alert, App, ionicBootstrap, Loading, Platform} from "ionic-angular";
import {StatusBar} from "ionic-native";
import {TabsPage} from "./pages/tabs/tabs";
import {getProviders} from "./AppFactory";

import {MigrationUtil} from "./util/migration/MigrationUtil";

@Component({
    template: `<ion-nav id="nav" [root]="rootPage"></ion-nav>`,
})
export class MyApp {
    rootPage:any = TabsPage;

    constructor(private app:App, migrationUtil:MigrationUtil, platform:Platform) {
        this.app = app;
        platform.ready().then(() => {
            this.rootPage = TabsPage;
            StatusBar.styleDefault();
            let loading = Loading.create({
                content: "Initializing..."
            });
            let nav = app.getComponent("nav");

            nav.present(loading);

            // always show the beautiful ionic alerts instead of
            // default JS alerts, but be aware these bad boys
            // no longer block execution
            this.overrideAlert();

            // do the database migrations, then remove the loader
            migrationUtil.executeMigrations().then(() => {
                // set a short timeout for the sake of presentation
                setTimeout(() => {
                    loading.dismiss();
                }, 500);
            }).catch(error => {
                loading.dismiss();
                alert(`An error occurred during migrations - ${error.message}`);
            });

        });
    }

    overrideAlert(){
        // this is probably uncool but I am super lazy so be cool bruh
        var self = this;
        window.alert = content => {
            let alert = Alert.create({
                title: "Error",
                subTitle: content,
                buttons: ["Ok"]
            });
            let nav = self.app.getComponent("nav");
            nav.present(alert);
        };
    }
}

ionicBootstrap(MyApp, getProviders(), {
});
