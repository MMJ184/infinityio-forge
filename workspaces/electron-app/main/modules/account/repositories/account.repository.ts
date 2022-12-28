import { Item } from '../model/item.schema';
import { DatabaseService } from '../../services/db.service';
import { JsonValue } from 'type-fest';
import { fluentProvide } from 'inversify-binding-decorators';
import { IPCAccountsInsert } from '../../../shared/ipc/accounts.ipc';
import { logger } from '../../../shared/helper/logger.helper';
import { IPCInsertData } from '../../../shared/ipc/views.ipc';

@fluentProvide(AccountRepository).inSingletonScope().done()
export class AccountRepository {
  private _database: DatabaseService;
  //private itemRepo: Repository<Item>;

  constructor(database: DatabaseService) {
    logger.info('Account repository run.');

    this._database = database;
    //this.itemRepo = database.connection.getRepository(Item);
  }

  public Insert(req: JsonValue): Promise<JsonValue> {
    let reqMessage: IPCAccountsInsert.Request = new IPCAccountsInsert.Request(
      req
    );

    let isValid: boolean = false;
    let dbError: string = '';
    let dbRes: any;

    var itemRepo = this._database.getRepository(Item);

    if (req) {
      var requestedData = reqMessage.toMessage().data;

      logger.info('3] Data on electron main service.', requestedData);

      var item: Item = JSON.parse(JSON.stringify(requestedData));

      logger.info('4] electron main model.', JSON.stringify(item));

      dbRes = itemRepo.insert(item);

      logger.info('Database response.', JSON.stringify(dbRes));

      isValid = true;
      dbError = 'Data Insert Done.';

      logger.info("Data Insert Done.");
    }

    let resMessage: IPCInsertData.Response = new IPCInsertData.Response({
      valid: isValid,
      error: dbError,
    });

    console.log('Response.', resMessage.toMessage());
    return Promise.resolve(resMessage.toJsonValue());
  }
}
