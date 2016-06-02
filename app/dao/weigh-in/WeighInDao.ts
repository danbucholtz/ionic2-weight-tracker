import {Injectable} from "@angular/core";
import {BaseDao} from "../BaseDao";
import {WeighIn} from "./WeighIn";
import {WeighInConverter} from "./WeighInConverter";
import {DatabaseManager} from "../DatabaseManager";

const tableName = "weighIns";

@Injectable()
export class WeighInDao extends BaseDao<WeighIn>{

    constructor(weighInConverter:WeighInConverter, databaseManager:DatabaseManager){
        super(tableName, weighInConverter, databaseManager);
    }

    createTableIfDoesntExist():Promise<any>{
		return this.databaseManager.executeQuery(`CREATE TABLE IF NOT EXISTS ${tableName} (id text primary key not null, weight real not null, created text not null, updated text not null)`, null);
	}

    insert(object:any):Promise<any>{
        var query = `
            INSERT INTO ${tableName}
            (id, weight, created, updated)
            VALUES (?, ?, ?, ?)
        `;
        return this.databaseManager.executeQuery(query, [object.id, object.weight, object.created, object.updated]);
    }

    update(object:any):Promise<any>{
        var query = `
            UPDATE ${tableName}
            SET weight=?, created=?, updated=?
            WHERE id=?
        `;
        return this.databaseManager.executeQuery(query, [object.weight, object.created, object.updated, object.id]);
    }
}
