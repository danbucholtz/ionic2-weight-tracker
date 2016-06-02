import {Injectable} from "@angular/core";

import {Migration} from "./Migration";
import {MigrationOne} from "./MigrationOne";
import {MigrationTwo} from "./MigrationTwo";

@Injectable()
export class MigrationProvider{

    private _migrations:Migration[];

    constructor(migrationOne:MigrationOne, migrationTwo:MigrationTwo){
        this._migrations = [];
        this._migrations.push(migrationOne);
        this._migrations.push(migrationTwo);
    }

    getMigrations():Migration[]{
        return this._migrations;
    }
}
