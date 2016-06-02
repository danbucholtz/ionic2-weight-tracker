import {Component} from "@angular/core";

import {Photo} from "../../dao/photos/Photo";
import {PhotoDao} from "../../dao/photos/PhotoDao";
import {WeighIn} from "../../dao/weigh-in/WeighIn";
import {WeighInDao} from "../../dao/weigh-in/WeighInDao";

@Component({
    template: `
    <ion-navbar *navbar primary>
        <ion-title>Photo List</ion-title>
    </ion-navbar>
    <ion-content>
        <ion-list>
            <div *ngFor="let weighIn of _weighIns">
                <ion-list-header class="light-background">
                    {{weighIn.headline}} - {{weighIn.weight}} LBS
                </ion-list-header>
                <div *ngIf="weighIn?.photos.length > 0">
                    <ion-item-sliding *ngFor="let photo of weighIn.photos">
                        <ion-item>
                            <img style="width: 100%" [src]="photo.filePath">
                        </ion-item>
                        <ion-item-options>
                            <button danger (click)="deleteWeighIn(weighIn)">Delete</button>
                        </ion-item-options>
                    </ion-item-sliding>
                </div>
                <div *ngIf="!weighIn.photos || weighIn.photos.length === 0">
                    <ion-item-sliding>
                        <ion-item>
                            No Photos Found
                        </ion-item>
                        <ion-item-options>
                            <button danger (click)="deleteWeighIn(weighIn)">Delete</button>
                        </ion-item-options>
                    </ion-item-sliding>
                </div>
            </div>
        </ion-list>
    </ion-content>
    `
})
export class PhotoList{
    private _weighIns:WeighIn[];

    constructor(private photoDao:PhotoDao, private weighInDao:WeighInDao){
        this.photoDao = photoDao;
        this.weighInDao = weighInDao;
        this._weighIns = [];
    }

    ionViewDidEnter(){
        this.loadData();
    }

    loadData():void{
        let _map = null;
        this.getWeighInPhotoMap().then(map => {
            _map = map;
            return this.weighInDao.getAll();
        }).then(weighIns => {
           for ( let weighIn of weighIns ){
               weighIn.photos = _map.get(weighIn.id) || [];
           }
           return weighIns;
       }).then(weighIns => {
         for ( let weighIn of weighIns ){
           weighIn.headline = `${weighIn.created.getMonth() + 1}/${weighIn.created.getDate()}/${weighIn.created.getFullYear().toString().substr(2,2)}`;
         }
         return weighIns;
       }).then(results => {
            //this.ngZone.run(() => {
                this._weighIns = results;
            //});
        }).catch(error => {
           alert(`Failed to load photos and weigh-in data - ${error.message}`);
        });
    }

    getWeighInPhotoMap(){
        let map:Map<string, Photo[]> = new Map<string, Photo[]>();
        return this.photoDao.getAll().then(photos => {
           for ( let photo of photos ){
               let list:Photo[] = map.get(photo.weighInId);
               if ( ! list ){
                   list = [];
               }
               list.push(photo);
               map.set(photo.weighInId, list);
           }
           return map;
        });
    }

    deleteWeighIn(weighIn:WeighIn):void{
        // first, delete the photos associated with item
        let promises:Promise<any>[] = [];
        for ( let photo of weighIn.photos ){
            promises.push(this.photoDao.delete(photo.id));
        }
        Promise.all(promises).then(() => {
           return this.weighInDao.delete(weighIn.id);
        }).then( () => {
            return this.loadData();
        }).catch(error => {
           alert(`Failed to delete weigh in and photos - ${error.message}`);
        });
    }
}
