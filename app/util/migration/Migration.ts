export interface Migration{
    getVersion():number;
    migrate():Promise<any>;
}