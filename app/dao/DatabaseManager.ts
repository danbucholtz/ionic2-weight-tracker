import {Injectable} from "angular2/core";

import {Storage, SqlStorage} from "ionic-angular";

const databaseName = "weightTracker.db";

@Injectable()
export class DatabaseManager{

    private storage:Storage;

    constructor(){
        this.storage = new Storage(SqlStorage, {name: databaseName});
    }

    executeQuery(query:string, parameters:any[]){
        if ( ! parameters ){
            parameters = [];
        }
        return this.storage.query(query, parameters).then(function(response){
            return response.res; 
        });
    }
}
