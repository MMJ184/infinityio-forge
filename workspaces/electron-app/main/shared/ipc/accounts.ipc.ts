import { IPCBaseMessage } from "./base/base.ipc";


// Insert
export namespace IPCAccountsInsert {
  export interface IPCAccountsInsert {
    [key: string]: any;
  }
  export interface IRequest {
    table: string;
    data: IPCAccountsInsert;
  }
  export interface IResponse {
    valid: boolean;
    error?: string;
  }
  export class Request extends IPCBaseMessage<IRequest> {}
  export class Response extends IPCBaseMessage<IResponse> {}
  export const CHANNEL: string = 'CH_ACCOUNT_INSERT';
}
