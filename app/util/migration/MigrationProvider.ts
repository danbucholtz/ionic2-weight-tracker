import {Injectable} from "angular2/core";

import {Migration} from "./Migration";
import {MigrationOne} from "./MigrationOne";

Injectable()
export class MigrationProvider{
    
    private _migrations:Migration[];
    
    constructor(migrationOne:MigrationOne){
        this._migrations = [];
        this._migrations.push(migrationOne);
    }
    
    getMigrations():Migration[]{
        return this._migrations;
    }
}