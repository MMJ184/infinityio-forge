import { IPCBaseMessage } from '../base/base.ipc';
import {
  IIPCPagination,
  IIPCWhere,
  IIPCOrderBy,
  IIPCJoin,
  IIPCSearch,
} from '../readData/read-data.ipc';

// Insert
export namespace IPCUserInsert {
  export interface IPCUserInsert {
    [key: string]: any;
  }
  export interface IRequest {
    table: string;
    data: IPCUserInsert;
  }
  export interface IResponse {
    valid: boolean;
    error?: string;
  }
  export class Request extends IPCBaseMessage<IRequest> {}
  export class Response extends IPCBaseMessage<IResponse> {}
  export const CHANNEL: string = 'CH_USER_INSERT';
}

export namespace IPCGetAllUsers {
  export interface IRequest {
    table: string;
    pagination: IIPCPagination;
    columns: string[];
    orderBy?: IIPCOrderBy[];
    search?: IIPCSearch;
    where?: IIPCWhere[];
    join?: IIPCJoin[];
  }

  export interface IResponse {
    valid: boolean;
    error?: string;
    data?: {
      [key: string]: any;
    }[];
    count?: number;
  }

  export class Request extends IPCBaseMessage<IRequest> {}
  export class Response extends IPCBaseMessage<IResponse> {}
  export const CHANNEL: string = 'CH_GET_ALL_USERS';
}
