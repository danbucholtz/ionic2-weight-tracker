import {Events, Page} from "ionic-angular";

import {Camera} from "ionic-native";
import {File} from "ionic-native";

import {Photo} from "../../dao/photos/Photo";
import {PhotoDao} from "../../dao/photos/PhotoDao";
import {WeighIn} from "../../dao/weigh-in/WeighIn";
import {WeighInDao} from "../../dao/weigh-in/WeighInDao";

import {NgZone} from "angular2/core";

@Page({
    template: `
    <ion-navbar *navbar primary>
        <ion-title>Enter Weight</ion-title>
    </ion-navbar>
    <ion-content>
        <ion-item>
            <ion-label fixed>Weight <span danger>*</span></ion-label>
            <ion-input type="number" [(ngModel)]="weighIn.weight" min="50" max="1000"></ion-input>
        </ion-item>
        <button ion-item (click)="takePhoto()">
            <span class="gray-text">Take Photo</span>
        </button>
        <ion-item *ngFor="#photo of photos">
            <img [src]="photo.filePath">
        </ion-item>
        <div padding>
            <button primary block [disabled]="!weighIn.weight" (click)="saveWeighIn()">Save Weigh In</button>
        </div>
    </ion-content>
    `
})
export class WeighInForm{
    
    private eventDispatcher:Events;
    private photoDao:PhotoDao;
    private weighInDao:WeighInDao
    private weighIn:WeighIn;
    private photos:Photo[];
    private ngZone:NgZone;
    
    constructor(eventDispatcher:Events, photoDao:PhotoDao, weighInDao:WeighInDao, ngZone:NgZone){
        this.eventDispatcher = eventDispatcher;
        this.photoDao = photoDao;
        this.weighInDao = weighInDao;
        this.ngZone = ngZone;
        this.photos = [];
    }
    
    onPageWillEnter(){
        this.weighIn = new WeighIn();
    }
    
    takePhoto(){
        let options = {
			quality: 80,
			destinationType: window["Camera"].DestinationType.FILE_URI,
			encodingType: window["Camera"].EncodingType.JPEG,
			correctOrientation: true
		};
        
        Camera.getPicture(options).then(fileUrl => {
           let currentFileName = fileUrl.replace(/^.*[\\\/]/, "");
           let pathMinusFileName = fileUrl.replace(currentFileName, "");
           let newfileName = `${(new Date()).getTime()}.jpg`;
           return File.moveFile(pathMinusFileName, currentFileName, window["cordova"].file.dataDirectory, newfileName);
        }).then(fileDescriptor => {
           return fileDescriptor.nativeURL; 
        }).then(fileUrl => {
            let photo = new Photo();
            photo.filePath = fileUrl;
            this.ngZone.run( () => {
                this.photos.push(photo);    
            });
        }).catch(error => {
           alert(`Failed to take photo and persist to app storage - ${error.message}`); 
        });
    }
    
    saveWeighIn(){
        // first, save the weighIn object
        this.weighInDao.save(this.weighIn).then(entity => {
            // sweet, the weighIn was saved, now loop through the photos and save each of those
            let promises = [];
            for ( let photo of this.photos ){
                photo.weighInId = entity.id;
                promises.push(this.photoDao.save(photo));
            }
            return Promise.all(promises);
        }).then(() => {
          // w00t, the saves were successful, so now go ahead and switch to the progress tab
          this.eventDispatcher.publish("weighInComplete", {});
        }).catch(error => {
           alert(`Failed to save weigh-in record and/or photos - ${error.message}`); 
        });
    }
}
