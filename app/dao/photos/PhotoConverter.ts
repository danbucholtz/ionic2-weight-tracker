import {Injectable} from "angular2/core";
import {IConverter} from "../IConverter";
import {Photo} from "./Photo";

@Injectable()
export class PhotoConverter implements IConverter<Photo>{
    
    convertModelToPersistableFormat(model:Photo):any{
        let toPersist:any = {};
        toPersist.id = model.id;
        toPersist.filePath = model.filePath;
        toPersist.weighInId = model.weighInId;
        toPersist.created = model.created.toJSON();
        toPersist.updated = model.updated.toJSON();
        return toPersist;
    }
    
    convertPersistableFormatToModel(persistable:any):Photo{
        let photo:Photo = new Photo();
        photo.id = persistable.id;
        photo.filePath = persistable.filePath;
        photo.weighInId = persistable.weighInId;
        photo.created = new Date(persistable.created);
        photo.updated = new Date(persistable.updated);
        return photo;
    }
}