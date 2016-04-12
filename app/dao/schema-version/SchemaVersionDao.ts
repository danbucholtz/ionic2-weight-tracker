import {Injectable} from "angular2/core";
import {BaseDao} from "../BaseDao";
import {SchemaVersion} from "./SchemaVersion";
import {SchemaVersionConverter} from "./SchemaVersionConverter";
import {DatabaseManager} from "../DatabaseManager";

const tableName = "schemaVersions";

@Injectable()
export class SchemaVersionDao extends BaseDao<SchemaVersion>{
    
    constructor(schemaVersionConverter:SchemaVersionConverter, databaseManager:DatabaseManager){
        super(tableName, schemaVersionConverter, databaseManager);
    }
    
    createTableIfDoesntExist():Promise<any>{
		return this.databaseManager.executeQuery(`CREATE TABLE IF NOT EXISTS ${tableName} (id text primary key not null, version integer not null, created text not null, updated text not null)`, null);
	}
    
    insert(object:any):Promise<any>{
        var query = `
            INSERT INTO ${tableName}
            (id, version, created, updated)
            VALUES (?, ?, ?, ?)
        `;
        return this.databaseManager.executeQuery(query, [object.id, object.version, object.created, object.updated]);
    }
    
    update(object:any):Promise<any>{
        var query = `
            UPDATE ${tableName}
            SET version=?, created=?, updated=?
            WHERE id=?
        `;
        return this.databaseManager.executeQuery(query, [object.version, object.created, object.updated, object.id]);
    }
}