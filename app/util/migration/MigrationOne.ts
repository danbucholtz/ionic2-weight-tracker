import {Injectable} from "angular2/core";

import {Migration} from "./Migration";

import {WeighInDao} from "../../dao/weigh-in/WeighInDao";

@Injectable()
export class MigrationOne implements Migration{
    
    constructor(private weighInDao:WeighInDao){
        this.weighInDao = weighInDao;
    }
    
    getVersion():number{
        return 1;
    }
    
    migrate():Promise<any>{
        console.log("MigrationOne: Creating Weigh-in Table ...");
        return this.weighInDao.createTableIfDoesntExist().then(() => {
            console.log("MigrationOne: Creating Weigh-in Table ... DONE");
            return null;
        });
    }
}