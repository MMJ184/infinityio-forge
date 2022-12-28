import { DatabaseService } from '../../services/db.service';
import { fluentProvide } from 'inversify-binding-decorators';
import { JsonValue } from 'type-fest';
import { logger } from '../../../shared/helper/logger.helper';
import { IPCDeleteData, IPCInsertData, IPCReadData, IPCUpdateData } from '../../../shared/ipc/views.ipc';

@fluentProvide(ViewRepository).inSingletonScope().done()
export class ViewRepository {
  private _database: DatabaseService;

  constructor(database: DatabaseService) {
    logger.info('View repository run.');

    this._database = database;
  }

  public async readData(req: JsonValue): Promise<JsonValue> {
    let reqMessage: IPCReadData.Request = new IPCReadData.Request(req);

    let isValid: boolean;
    let dbError: string;
    let dbRes: any;

    logger.info(`1] Electron: Get all ${reqMessage.toMessage().table} request start.`, reqMessage);

    let res = await this._database.readData(
      reqMessage.toMessage().table,
      reqMessage.toMessage().columns,
      reqMessage.toMessage().pagination.take,
      reqMessage.toMessage().pagination.skip,
      reqMessage.toMessage().search.columns,
      reqMessage.toMessage().search.text,
      reqMessage.toMessage().where,
      reqMessage.toMessage().orderBy,
      reqMessage.toMessage().join
    );
    console.log(res);
    if (res instanceof Error) {
      dbError = res.toString();
      isValid = false;
    } else {
      isValid = true;
      dbRes = res;
    }

    let resMessage: IPCReadData.Response = new IPCReadData.Response({
      valid: isValid,
      error: dbError,
      data: dbRes.data,
      count: dbRes.count,
    });

    console.log('resMessage', resMessage.toMessage());
    return Promise.resolve(resMessage.toJsonValue());
  }

  public async updateData(req: JsonValue): Promise<JsonValue> {
    let reqMessage: IPCUpdateData.Request = new IPCUpdateData.Request(req);

    let isValid: boolean;
    let dbError: string;
    let dbRes: any;

    let res = await this._database.updateData(
      reqMessage.toMessage().table,
      reqMessage.toMessage().update,
      reqMessage.toMessage().where
    );
    console.log(res);
    if (res instanceof Error) {
      dbError = res.toString();
      isValid = false;
    } else {
      isValid = true;
      dbRes = res;
    }

    let resMessage: IPCUpdateData.Response = new IPCUpdateData.Response({
      valid: isValid,
      error: dbError,
    });

    console.log('resMessage', resMessage.toMessage());
    return Promise.resolve(resMessage.toJsonValue());
  }

  public async insertData(req: JsonValue): Promise<JsonValue> {
    let reqMessage: IPCInsertData.Request = new IPCInsertData.Request(req);

    let isValid: boolean;
    let dbError: string;
    let dbRes: any;

    let res = await this._database.insertData(
      reqMessage.toMessage().table,
      reqMessage.toMessage().data
    );
    console.log(res);
    if (res instanceof Error) {
      dbError = res.toString();
      isValid = false;
    } else {
      isValid = true;
      dbRes = res;
    }

    let resMessage: IPCInsertData.Response = new IPCInsertData.Response({
      valid: isValid,
      error: dbError,
    });

    console.log('resMessage', resMessage.toMessage());
    return Promise.resolve(resMessage.toJsonValue());
  }

  public async deleteData(req: JsonValue): Promise<JsonValue> {
    let reqMessage: IPCDeleteData.Request = new IPCDeleteData.Request(req);

    let isValid: boolean;
    let dbError: string;
    let dbRes: any;

    let res = await this._database.deleteData(
      reqMessage.toMessage().table,
      reqMessage.toMessage().where
    );
    console.log(res);
    if (res instanceof Error) {
      dbError = res.toString();
      isValid = false;
    } else {
      isValid = true;
      dbRes = res;
    }

    let resMessage: IPCDeleteData.Response = new IPCDeleteData.Response({
      valid: isValid,
      error: dbError,
    });

    console.log('resMessage', resMessage.toMessage());
    return Promise.resolve(resMessage.toJsonValue());
  }
}
