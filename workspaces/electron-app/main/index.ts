import * as fs from 'fs-extra';
import _ from 'lodash';
import * as path from 'node:path';
import { AppConfig } from 'shared-lib';
import { App } from './components/app';
import { BackendMain } from './configurations/module';

declare const global: Global;

declare global {
	// Global augmentation of the `Global` interface
	interface Global {
		appConfig: AppConfig;
	}
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Load config
const currentEnvironment = process.env.X_NODE_ENV || process.env.NODE_ENV;
const appConfigs = fs.readJsonSync(path.join(__dirname, 'config.json'));
const defaultConfig = appConfigs.development;
const currentConfig = appConfigs[currentEnvironment];
global.appConfig =
	currentEnvironment === 'development'
		? defaultConfig
		: _.merge(defaultConfig, currentConfig);

const backend = new BackendMain();
backend.listen();

// Launch app
App.launch();
