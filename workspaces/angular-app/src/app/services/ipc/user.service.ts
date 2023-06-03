import { EventEmitter, Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import {
	IPCGetAllUsers,
	IPCUserInsert,
} from '../../../../../electron-app/main/shared/ipc/user/user.ipc';
import {
	IIPCJoin,
	IIPCOrderBy,
	IIPCWhere,
	IPCReadData,
} from '../../../../../electron-app/main/shared/ipc/readData/read-data.ipc';
import { IPCInsertData } from '../../../../../electron-app/main/shared/ipc/views.ipc';
import { ElectronIpcService } from '../electron-ipc.service';

@Injectable({
	providedIn: 'root',
})
export class UsersIPCService {
	checkAll = false;
	searchText = '';
	// pagerConfig: PagerConfig = null;
	pageIndex = 1;
	pageSize = 10;
	rowCount = 0;
	sortColumn = '';
	sortOrder = '';

	selectedProject = null;

	// 0: project list, 1: check all change
	changeProject: EventEmitter<any> = new EventEmitter();
	// private _ipcRenderer: IpcRenderer | undefined = void 0;

	constructor(private electronIpc: ElectronIpcService) {
		// if (window.require) {
		// 	try {
		// 		this._ipcRenderer = window.require('electron').ipcRenderer;
		// 	} catch (e) {
		// 		throw e;
		// 	}
		// } else {
		// 	console.warn("Electron's IPC was not loaded");
		// }
	}

	public async insert(
		table: string,
		data: IPCUserInsert.IPCUserInsert
	): Promise<IPCUserInsert.IResponse> {
		const req: IPCUserInsert.Request = new IPCUserInsert.Request({
			table: table,
			data: data,
		});
		console.log(
			'2] Angular Ipc Service >>> Data request for insert.',
			JSON.stringify(req)
		);

		// this.logConsoleService.addItem(
		//   ConsoleLogItemType.info,
		//   req.toJsonValue(),
		//   getCurrentLine().method
		// )

		const rawRes: any = await this.electronIpc?.send(
			IPCInsertData.CHANNEL,
			req.toJsonValue()
		);

		console.log('Angular Ipc Service >>> Data inserted.', rawRes);

		return new IPCUserInsert.Response(rawRes).toMessage();
	}

	// setPager() {
	// 	this.pagerConfig = null;
	// 	this.pagerConfig = new PagerConfig();
	// 	this.pagerConfig.totalRows = this.rowCount; //total
	// 	this.pagerConfig.pageSize = this.pageSize; //10
	// 	this.pagerConfig.pageIndex = this.pageIndex; // no of page
	// }

	public async getUsers(
		table: string,
		columns: string[],
		take: number,
		skip: number,
		searchColumns?: string[],
		searchText?: string,
		where?: IIPCWhere[],
		orderBy?: IIPCOrderBy[],
		join?: IIPCJoin[]
	): Promise<IPCGetAllUsers.IResponse> {
		const req: IPCGetAllUsers.Request = new IPCGetAllUsers.Request({
			table: table,
			columns: columns,
			orderBy: orderBy,
			pagination: {
				take: take,
				skip: skip,
			},
			search: {
				columns: searchColumns,
				text: searchText,
			},
			where: where,
			join: join,
		});

		console.log(
			'Angular: Request send for Get all users.',
			JSON.stringify(req)
		);

		// this.logConsoleService.addItem(
		//   ConsoleLogItemType.info,
		//   req.toJsonValue(),
		//   getCurrentLine().method
		// );

		const rawRes: any = await this.electronIpc._ipcRenderer?.invoke(
			IPCReadData.CHANNEL,
			req.toJsonValue()
		);

		// const rawRes: any = await this.electronIpc.send(
		// 	IPCReadData.CHANNEL,
		// 	req.toJsonValue()
		// );


		
		console.log('Angular: Request received for Get all users.', rawRes);

		return new IPCGetAllUsers.Response(rawRes).toMessage();
	}
}
