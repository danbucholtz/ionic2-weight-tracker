
/* Data Access */
import {DatabaseManager} from "./dao/DatabaseManager";
import {PhotoConverter} from "./dao/photos/PhotoConverter";
import {PhotoDao} from "./dao/photos/PhotoDao";
import {SchemaVersionConverter} from "./dao/schema-version/SchemaVersionConverter";
import {SchemaVersionDao} from "./dao/schema-version/SchemaVersionDao";
import {WeighInConverter} from "./dao/weigh-in/WeighInConverter";
import {WeighInDao} from "./dao/weigh-in/WeighInDao";

/* Migrations */
import {MigrationOne} from "./util/migration/MigrationOne";
import {MigrationTwo} from "./util/migration/MigrationTwo";
import {MigrationProvider} from "./util/migration/MigrationProvider";
import {MigrationUtil} from "./util/migration/MigrationUtil";

export function getProviders():any[]{
    let providers:any[] = [];
    /* Data Access */
    providers.push(DatabaseManager);
    providers.push(PhotoConverter);
    providers.push(PhotoDao);
    providers.push(SchemaVersionConverter);
    providers.push(SchemaVersionDao);
    providers.push(WeighInConverter);
    providers.push(WeighInDao);
    
    /* Migrations */
    providers.push(MigrationOne);
    providers.push(MigrationTwo);
    providers.push(MigrationProvider);
    providers.push(MigrationUtil);
    
    return providers;
}