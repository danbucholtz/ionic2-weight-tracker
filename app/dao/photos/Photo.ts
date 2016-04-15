import {IEntity} from "../IEntity";

export class Photo implements IEntity{
    public id:string;
    public filePath:string;
    public weighInId:string;
    public created:Date;
    public updated:Date;
    
    public constructor(){
    }
}