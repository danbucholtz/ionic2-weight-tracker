import {Injectable} from "angular2/core";
import {IConverter} from "../IConverter";
import {WeighIn} from "./WeighIn";

@Injectable()
export class WeighInConverter implements IConverter<WeighIn>{
    
    
    convertModelToPersistableFormat(model:WeighIn):any{
        let toPersist:any = {};
        toPersist.id = model.id;
        toPersist.weight = model.weight;
        toPersist.photoFileName = model.photoFileName;
        toPersist.created = model.created.toJSON();
        toPersist.updated = model.updated.toJSON();
        return toPersist;
    }
    
    convertPersistableFormatToModel(persistable:any):WeighIn{
        let weighIn:WeighIn = new WeighIn();
        weighIn.id = persistable.id;
        weighIn.weight = persistable.weight;
        weighIn.photoFileName = persistable.photoFileName;
        weighIn.created = new Date(persistable.created);
        weighIn.updated = new Date(persistable.updated);
        return weighIn;
    }
}