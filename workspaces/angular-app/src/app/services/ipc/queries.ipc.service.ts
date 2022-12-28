// import { Injectable } from '@angular/core';
// import { ipcRenderer } from 'electron-better-ipc';
// import { LogConsoleService } from '../log-console.service';
// import getCurrentLine from 'get-current-line';
// import { IPCQuery } from '../../../../../app/share/ipc/queries.ipc';
// import { ConsoleLogItemType } from '../../../../../app/share/interfaces/log-console.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class QueriesIPCService {
  
//   constructor(private logConsoleService:LogConsoleService) { }

//   public async executeQuery(query: string): Promise<IPCQuery.IResponse> {
//     const req: IPCQuery.Request = new IPCQuery.Request({
//       query: query
//     });
//     console.log("req", req);

//     this.logConsoleService.addItem(
//       ConsoleLogItemType.info, 
//       req.toJsonValue(), 
//       getCurrentLine().method
//     )

//     const rawRes:any = await ipcRenderer.invoke(IPCQuery.CHANNEL, req.toJsonValue());
//     console.log("rawRes", rawRes);
//     return new IPCQuery.Response(rawRes).toMessage()
//   }

// }
