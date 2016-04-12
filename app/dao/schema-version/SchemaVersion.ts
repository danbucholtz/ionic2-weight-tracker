import {IEntity} from "../IEntity";

export class SchemaVersion implements IEntity{
    public id:string;
    public version:number;
    public created:Date;
    public updated:Date;
}