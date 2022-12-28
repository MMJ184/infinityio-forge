import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { NgxSpinnerService } from 'ngx-spinner';
import { IPCAccountsInsert } from '../../../../../electronApp/share/ipc/accounts.ipc';
import { LogConsoleService } from '../log-console.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsIPCService {
  private _ipcRenderer: IpcRenderer | undefined = void 0;

  constructor(
    private spinner: NgxSpinnerService,
    private logConsoleService: LogConsoleService
  ) {
    if (window.require) {
      try {
        this._ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron's IPC was not loaded");
    }
  }

  public async insertData(
    table: string,
    data: IPCAccountsInsert.IPCAccountsInsert
  ): Promise<IPCAccountsInsert.IResponse> {
    const req: IPCAccountsInsert.Request = new IPCAccountsInsert.Request({
      table: table,
      data: data,
    });
    console.log('2] Angular Ipc Service.', JSON.stringify(req));

    // this.logConsoleService.addItem(
    //   ConsoleLogItemType.info,
    //   req.toJsonValue(),
    //   getCurrentLine().method
    // )

    const rawRes: any = await this._ipcRenderer?.invoke(
      IPCAccountsInsert.CHANNEL,
      req.toJsonValue()
    );

    console.log('rawRes', rawRes);

    return new IPCAccountsInsert.Response(rawRes).toMessage();
  }
}
