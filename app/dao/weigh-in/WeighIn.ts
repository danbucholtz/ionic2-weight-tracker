import {IEntity} from "../IEntity";

import {Photo} from "../photos/Photo";

export class WeighIn implements IEntity{
    public id:string;
    public weight:number;
    public photos:Photo[]; // not persisted, just there for presentation
    public created:Date;
    public updated:Date;
    
    public constructor(){
    }
}