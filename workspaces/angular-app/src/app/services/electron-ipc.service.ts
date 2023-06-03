import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { WindowApi } from 'shared-lib';
import { JsonValue } from 'type-fest';

@Injectable({
	providedIn: 'root',
})
export class ElectronIpcService {
	private _api!: WindowApi;
	
	public _ipcRenderer: IpcRenderer | undefined = void 0;

	constructor(private zone: NgZone) {
		if (window && (window as Window).api) {
			this._api = (window as Window).api;
			console.log('Preloader API has been loaded successfully');
		} else {
			console.warn('Preloader API is not loaded');
		}
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

	public receive<Out>(channel: string, callback: (output: Out) => void): void {
		if (this._api) {
			this._api.receive<Out>(channel, (output) => {
				console.log(`Received from main process channel [${channel}]`, output);

				// Next code might run outside of Angular zone and therefore Angular
				// doesn't recognize it needs to run change detection
				// Further details on SO : https://stackoverflow.com/a/49136353/11480016
				this.zone.run(() => {
					callback(output);
				});
			});
		}
	}

	public send<In>(channel: string, input: In): void {
		if (this._api) {
			console.log(`Sending to main process channel [${channel}]`, input);
			this._api.send<In>(channel, input);
		}
	}

	public handle(channel: string, input: JsonValue): JsonValue {
		if (this._api) {
			console.log(`Sending to main process channel [${channel}]`, input);
			var d = this._api.handle(channel, input);
			console.log(`recive from main process channel [${channel}]`, d);
		}
		return null;
	}
}
