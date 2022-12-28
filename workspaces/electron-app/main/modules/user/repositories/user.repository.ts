import { DatabaseService } from '../../services/db.service';
import { User } from '../model/user.schema';
import { fluentProvide } from 'inversify-binding-decorators';
import { JsonValue } from 'type-fest';
import { logger } from '../../../shared/helper/logger.helper';
import {
	IPCGetAllUsers,
	IPCUserInsert,
} from '../../../shared/ipc/user/user.ipc';
import { IPCInsertData } from '../../../shared/ipc/views.ipc';

@fluentProvide(UserRepository).inSingletonScope().done()
export class UserRepository {
	private _database: DatabaseService;

	constructor(database: DatabaseService) {
		logger.info('User repository run.');

		this._database = database;
	}

	public Insert(req: JsonValue): Promise<JsonValue> {
		logger.info('electron main service start.', req);
		let reqMessage: IPCUserInsert.Request = new IPCUserInsert.Request(req);

		let isValid: boolean = false;
		let dbError: string = '';
		let dbRes: any;

		var userRepo = this._database.getRepository(User);

		if (req) {
			var requestedData = reqMessage.toMessage().data;

			logger.info('3] Data on electron main service.', requestedData);

			var user: User = JSON.parse(JSON.stringify(requestedData));

			user.createdBy = 'Infinity';
			user.createdAt = new Date();

			logger.info('4] electron main model.', JSON.stringify(user));

			dbRes = userRepo.insert(user);

			logger.info(JSON.stringify(dbRes));

			isValid = true;
			dbError = 'Data Insert Done.';
		}

		let resMessage: IPCInsertData.Response = new IPCInsertData.Response({
			valid: isValid,
			error: dbError,
		});

		logger.info('resMessage', resMessage.toMessage());
		return Promise.resolve(resMessage.toJsonValue());
	}

	public async getUsers(req: JsonValue): Promise<JsonValue> {
		let reqMessage: IPCGetAllUsers.Request = new IPCGetAllUsers.Request(req);

		let isValid: boolean = false;
		let dbError: string = '';
		let dbRes: any;

		logger.info('Electron: Get all users request start.', reqMessage);

		var itemRepo = this._database.getRepository(User);

		if (req) {
			// var selectColumns = reqMessage.toMessage().columns;
			var request = reqMessage.toMessage();

			var pageWhere: any = {};

			// set where
			reqMessage.toMessage().where.map((x) => {
				pageWhere[x.column] = [x.value];
			});

			//set search
			// if (
			//   request.search != null &&
			//   request.search.columns != null &&
			//   request.search.columns.length > 0
			// ) {
			//   request.search.columns.map((x) => {
			//     pageWhere[x] = [`%${request.search.text}%`];
			//   });
			// }

			logger.info(
				'Where: ',
				JSON.stringify({ IsDeleted: false, ...pageWhere })
			);

			dbRes = await itemRepo.findAndCount({
				where: { IsDeleted: false, ...pageWhere },
				// order: { request.orderBy[]: 'DESC' },
				take: request.pagination.take,
				skip: request.pagination.skip,
			});

			// logger.info('Electron: Get all users with count.', dbRes);

			isValid = true;
			dbError = 'Electron: Get all users request end.';
		}

		let resMessage: IPCGetAllUsers.Response = new IPCGetAllUsers.Response({
			valid: isValid,
			error: dbError,
			count: dbRes[1],
			data: dbRes[0],
		});

		logger.info('Electron: response', resMessage.toMessage());
		return Promise.resolve(resMessage.toJsonValue());
	}
}
