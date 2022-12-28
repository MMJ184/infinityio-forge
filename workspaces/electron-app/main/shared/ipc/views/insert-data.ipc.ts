import { IPCBaseMessage } from "../base/base.ipc";

export namespace IPCInsertData {
    export interface IIPCInsertData {
        [key: string]: any;
    }
    export interface IRequest {
        table: string;
        data: IIPCInsertData;
    }
    export interface IResponse {
        valid: boolean;
        error?: string;
    }
    export class Request extends IPCBaseMessage<IRequest> {}
    export class Response extends IPCBaseMessage<IResponse> {}
    export const CHANNEL: string = "CH_INSERT_DATA";
}