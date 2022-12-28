import { IPCBaseMessage } from '../base/base.ipc';

export namespace IPCReadData {

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
  export const CHANNEL: string = 'CH_READ_DATA';
}

export interface IIPCPagination {
  take: number;
  skip: number;
}

export interface IIPCSearch {
  columns?: string[];
  text?: string;
}

export interface IIPCOrderBy {
  columns: string[];
  isDescending: boolean;
}

export interface IIPCWhere {
  column: string;
  opr: IIPCWhereOperator | string;
  value: any;
  or: boolean;
}

export interface IIPCJoin {
  table: string;
  on: {
    local: string;
    target: string;
    opr: IIPCWhereOperator;
  };
}

export enum IIPCWhereOperator {
  EQ = '=',
  GT = '>',
  LT = '<',
}
