import {Injectable} from "angular2/core";

import {IConverter} from "./IConverter";
import {IEntity} from "./IEntity";
import {DatabaseManager} from "./DatabaseManager";

import * as uuid from "node-uuid";

@Injectable()
export class BaseDao<T extends IEntity>{
    constructor(protected tableName:string, protected converter:IConverter<T>, protected databaseManager:DatabaseManager){
        this.tableName = tableName;
        this.converter = converter;
        this.databaseManager = databaseManager;
    }
    
    createTableIfDoesntExist():Promise<any>{
		throw new Error("Child must implement this");
	}
    
    getAllMap():Promise<Map<string, T>>{
        return this.getAll().then(entities => {
           let map = new Map<string, T>();
           for ( let entity of entities ){
               map.set(entity.id, entity);
           }
           return map;
        });
    }
    
    getAll():Promise<T[]>{
        return this.getByQuery("", null);
    }
    
    getById(id:string):Promise<T>{
        return this.getOneByQuery(`WHERE id = ?`, [id]);
    }
    
    getFromIdList(listOfIds:string[]):Promise<T[]>{
        let questionMarks:string[] = [];
        for ( let i = 0; i < listOfIds.length; i++ ){
            questionMarks.push("?");
        }
        let questionMarkString:string = questionMarks.join();
        let query = `WHERE id IN (${questionMarkString})`;
        return this.getByQuery(query, listOfIds);
    }
    
    getByQuery(whereStatement, params):Promise<T[]>{
        return this.databaseManager.executeQuery(`SELECT * FROM ${this.tableName} ${whereStatement}`, params).then(results => {
            let rows = results.rows;
            let entities:T[] = [];
            for ( let i = 0; i < rows.length; i++ ){
                let persistedFormat = rows.item(i);
                let entity = this.converter.convertPersistableFormatToModel(persistedFormat);
                entities.push(entity);
            }
            return entities;
        });
    }
    
    getOneByQuery(whereStatement, params):Promise<T>{
        return this.getByQuery(whereStatement, params).then(entities => {
           if ( entities && entities.length > 0 ){
               return entities[0];
           }
           return null;
        });
    }
    
    protected update(persistableObject):Promise<any>{
       throw new Error("Child must implement this");
    }
    
    protected insert(persistableObject):Promise<any>{
        throw new Error("Child must implement this");
    }
    
    save(entity:T):Promise<T>{
        if ( entity.id ){
            entity.updated = new Date();
            let persistableObject = this.converter.convertModelToPersistableFormat(entity);
            return this.update(persistableObject).then(saved => {
               return this.converter.convertPersistableFormatToModel(saved); 
            });
        }
        else{
            entity.id = uuid.v4();
            entity.updated = new Date();
            entity.created = new Date();
            let persistableObject = this.converter.convertModelToPersistableFormat(entity);
            return this.save(persistableObject).then(saved => {
               return this.converter.convertPersistableFormatToModel(saved); 
            });
        }
    }
    
    delete(id:string):Promise<void>{
        return this.databaseManager.executeQuery(`DELETE FROM ${this.tableName} WHERE id=?`, [id]);
    }
}