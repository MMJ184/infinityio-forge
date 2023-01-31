import { ipcMain } from 'electron';
import 'reflect-metadata';
import { fluentProvide } from 'inversify-binding-decorators';
import { JsonValue } from 'type-fest';
import { ViewRepository } from '../repositories/views.repository';
import {
	IPCDeleteData,
	IPCInsertData,
	IPCReadData,
	IPCUpdateData,
} from '../../../shared/ipc/views.ipc';
import { logger } from '../../../shared/helper/logger.helper';

@fluentProvide(ViewsIPC).inSingletonScope().done()
export class ViewsIPC {
	private _viewRepository: ViewRepository;

	constructor(viewRepository: ViewRepository) {
		this._viewRepository = viewRepository;
	}

	public listen() {
		logger.info(`electron views CHANNEL's ${IPCReadData.CHANNEL}`);
		ipcMain.handle(IPCReadData.CHANNEL, async (event, req: JsonValue) => {
			logger.info(`electron views running ${IPCReadData.CHANNEL}`);
			await this._viewRepository.readData(req);
		});
		ipcMain.handle(
			IPCUpdateData.CHANNEL,
			async (event, req: JsonValue) =>
				await this._viewRepository.updateData(req)
		);
		ipcMain.handle(
			IPCInsertData.CHANNEL,
			async (event, req: JsonValue) =>
				await this._viewRepository.insertData(req)
		);
		ipcMain.handle(
			IPCDeleteData.CHANNEL,
			async (event, req: JsonValue) =>
				await this._viewRepository.deleteData(req)
		);
	}
}
