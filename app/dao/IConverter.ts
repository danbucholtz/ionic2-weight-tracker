export interface IConverter<T>{
    convertModelToPersistableFormat(model:T):any;
    convertPersistableFormatToModel(persistable:any):T;
}