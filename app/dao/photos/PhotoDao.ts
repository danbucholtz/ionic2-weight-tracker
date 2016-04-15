import {Injectable} from "angular2/core";
import {BaseDao} from "../BaseDao";
import {Photo} from "./Photo";
import {PhotoConverter} from "./PhotoConverter";
import {DatabaseManager} from "../DatabaseManager";

const tableName = "photos";

@Injectable()
export class PhotoDao extends BaseDao<Photo>{
    
    constructor(photoConverter:PhotoConverter, databaseManager:DatabaseManager){
        super(tableName, photoConverter, databaseManager);
    }
    
    createTableIfDoesntExist():Promise<any>{
		return this.databaseManager.executeQuery(`CREATE TABLE IF NOT EXISTS ${tableName} (id text primary key not null, filePath text not null, weighInId text not null, created text not null, updated text not null)`, null);
	}
    
    insert(object:any):Promise<any>{
        var query = `
            INSERT INTO ${tableName}
            (id, filePath, weighInId, created, updated)
            VALUES (?, ?, ?, ?, ?)
        `;
        return this.databaseManager.executeQuery(query, [object.id, object.filePath, object.weighInId, object.created, object.updated]);
    }
    
    update(object:any):Promise<any>{
        var query = `
            UPDATE ${tableName}
            SET filePath=?, weighInId=?, created=?, updated=?
            WHERE id=?
        `;
        return this.databaseManager.executeQuery(query, [object.filePath, object.weighInId, object.created, object.updated, object.id]);
    }
}