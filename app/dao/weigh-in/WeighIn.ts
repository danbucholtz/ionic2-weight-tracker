import {IEntity} from "../IEntity";

export class WeighIn implements IEntity{
    public id:string;
    public weight:number;
    public photoFileName:string;
    public created:Date;
    public updated:Date;
    
    public constructor(){
    }
}