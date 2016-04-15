import {Injectable} from "angular2/core";

import {Migration} from "./Migration";

import {PhotoDao} from "../../dao/photos/PhotoDao";

@Injectable()
export class MigrationTwo implements Migration{
    
    constructor(private photoDao:PhotoDao){
        this.photoDao = photoDao;
    }
    
    getVersion():number{
        return 2;
    }
    
    migrate():Promise<any>{
        console.log("MigrationOne: Creating Photo Table ...");
        return this.photoDao.createTableIfDoesntExist().then(() => {
            console.log("MigrationOne: Creating Photo Table ... DONE");
            return null;
        });
    }
}