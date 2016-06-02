import {Injectable} from "@angular/core";

import {IConverter} from "../IConverter";
import {SchemaVersion} from "./SchemaVersion";

@Injectable()
export class SchemaVersionConverter implements IConverter<SchemaVersion>{


    convertModelToPersistableFormat(model:SchemaVersion):any{
        let toPersist:any = {};
        toPersist.id = model.id;
        toPersist.version = model.version;
        toPersist.created = model.created.toJSON();
        toPersist.updated = model.updated.toJSON();
        return toPersist;
    }

    convertPersistableFormatToModel(persistable:any):SchemaVersion{
        let schemaVersion:SchemaVersion = new SchemaVersion();
        schemaVersion.id = persistable.id;
        schemaVersion.version = persistable.version;
        schemaVersion.created = new Date(persistable.created);
        schemaVersion.updated = new Date(persistable.updated);
        return schemaVersion;
    }
}
