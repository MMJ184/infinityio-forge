import 'reflect-metadata';
import { fluentProvide } from 'inversify-binding-decorators';
import {
	DataSource,
	DataSourceOptions,
	EntityTarget,
	ObjectLiteral,
	Repository,
} from 'typeorm';
import * as path from 'path';
import { app, dialog } from 'electron';
import { logger } from '../../shared/helper/logger.helper';
import { User } from '../user/model/user.schema';

@fluentProvide(DatabaseService).inSingletonScope().done()
export class DatabaseService {
	private static instance: DatabaseService;
	private _appDataSource: DataSource;

	private constructor() {
		this.connect();
		console.log('Db Service start.');
	}

	public async disconnect() {
		if (this._appDataSource.isInitialized) {
			await this._appDataSource.destroy();
		}
	}

	public connect(): DataSource {
		let dbPath = path.join(
			app.getPath('appData'),
			'InfinityIo-Data',
			'database',
			'infinity.sqlite'
		);

		const config: DataSourceOptions = {
			type: 'sqlite',
			database: dbPath,
			synchronize: true,
			logging: 'all',
			logger: 'advanced-console',
			maxQueryExecutionTime: 1000,
			entities: [User],
			subscribers: [],
			migrations: ['../../migrations/*.{ts,js}'],
			migrationsTableName: '__migration',
			dropSchema: false,
		};

		logger.info('path:- ', dbPath);

		this._appDataSource = new DataSource(config);

		if (!this._appDataSource.isInitialized) {
			this._appDataSource
				.initialize()
				.then(async () => {
					console.log('Database is running.');
				})
				.catch((error) => {
					console.log('Database connection error.');
					console.log(error);
					return error;
				});
		}

		return this._appDataSource;
	}

	public getRepository<Entity extends ObjectLiteral>(
		target: EntityTarget<Entity>
	): Repository<Entity> {
		try {
			if (!this._appDataSource.isInitialized) {
				console.log('Connection Error, Reestablishing connection...');
				this.connect();
			}
			return this._appDataSource.getRepository(target);
		} catch (error: any) {
			return error;
		}
	}

	public async executeQuery(query: string): Promise<any | Error> {
		console.log('query', query);
		let findResult = ((result: any) => result[0]) as (
			result: any
		) => string | undefined;
		let findResultPG = ((result: any) => result.rows) as (
			result: any
		) => string | undefined;
		let findResultSQLite = ((result: any) => result) as (
			result: any
		) => string | undefined;

		try {
			// this.consoleLogService.addItem(
			//   ConsoleLogItemType.info,
			//   sqlFormatter.format(query),
			//   getCurrentLine().method
			// );
			let res = await this._appDataSource.query(query);
			return findResultSQLite(res);
		} catch (error) {
			return error;
		}
	}

	public async readData(
		table: string,
		columns: string[],
		take: number,
		skip: number,
		searchColumns?: string[],
		searchText?: string,
		where?: {
			column: string;
			opr: string;
			value: string;
			or: boolean;
		}[],
		orderBy?: { columns: string[]; isDescending: boolean }[],
		join?: {
			table: string;
			on: {
				local: string;
				target: string;
				opr: string;
			};
		}[]
	): Promise<any | Error> {
		try {
			let selectColumns = [...columns].map((col) =>
				!col.includes('.') ? `${table}.${col}` : `${col} as ${col}`
			);

			let qRepo = this._appDataSource.getRepository(table);
			let q = qRepo.createQueryBuilder(table).select(selectColumns);

			if (join) {
				join.forEach((j) => {
					q = q.leftJoin(
						j.table,
						`${table}.${j.on.local}`,
						`${j.table}.${j.on.target}`
					);
				});
			}

			if (searchColumns && searchText) {
				searchColumns.forEach((sCol, idx: number) => {
					if (!sCol.includes('.')) {
						sCol = `${table}.${sCol}`;
					}
					if (idx == 0) {
						q = q.where(`${sCol} like :${sCol}`, { sCol: `%${searchText}%` });
					} else {
						q = q.orWhere(`${sCol} like :${sCol}`, { sCol: `%${searchText}%` });
					}
				});
			}

			var pageWhere: any = {};

			// set where
			where.map((x) => {
				// pageWhere[`${table}.${x.column}`] = [x.value];
				pageWhere[`${x.column}`] = [x.value];
			});

			logger.info(
				'Where: ',
				JSON.stringify({ IsDeleted: false, ...pageWhere })
			);

			q = q.where(pageWhere);

			// if (where) {
			//   where.forEach((col, idx: number) => {
			//     let wCol = col.column;
			//     if (!wCol.includes('.')) {
			//       wCol = `${table}.${wCol}`;
			//     }
			//     if (idx == 0) {
			//       // if we have where before (from search) we must use andWhere, if no search use where
			//       var column = col.column;
			//       var value = col.value;
			//       // q = q[firstWhereFunc](col.column, col.opr, col.value);
			//       // logger.info(q[firstWhereFunc](col.column, col.opr, col.value));
			//       // var d = q.where({ id: col.value });
			//       // logger.info(JSON.stringify(d.getRawMany()));
			//       // q = q.where({`${col.column}` : `{col.value}`});
			//     } else {
			//       let whereFunc = col.or ? 'orWhere' : 'andWhere';
			//       q = q[whereFunc](col.column, col.opr, col.value);
			//     }
			//   });
			// }

			let countRes = 0;
			await q.getCount().then((resolve) => {
				countRes = resolve;
			});

			// this.consoleLogService.addItem(
			//   ConsoleLogItemType.info,
			//   sqlFormatter.format(q.toQuery(), formatterParams),
			//   getCurrentLine().method
			// );
			// let res = await q.limit(take).offset(skip);
			// let res = await q.take(take).skip(skip).execute();
			// let res = await q.take(take).skip(skip).getMany();
			let res: any;
			res = await q.take(take).skip(skip).setLock('dirty_read').getRawMany();

			// res = await this._appDataSource.manager.query(q.getQuery());

			logger.info('Result: ', res);

			console.log('raw query: ', q.getQueryAndParameters());

			return {
				data: res,
				count: countRes,
			};
		} catch (error) {
			return error;
		}
	}

	public async updateData(
		table: string,
		update: {
			[key: string]: any;
		},
		where?: {
			column: string;
			opr: string;
			value: string;
			or: boolean;
		}[]
	): Promise<boolean | Error> {
		try {
			let qRepo = this._appDataSource.getRepository(table);
			let q: any = qRepo.createQueryBuilder(table);

			// let q = this.connection.table(table);

			where.forEach((col, idx: number) => {
				if (idx == 0) {
					// q = q.where(col.column, MoreThan(col.value));
				} else {
					let whereFunc = col.or ? 'orWhere' : 'andWhere';
					q = q[whereFunc](col.column, col.opr, col.value);
				}
			});

			// this.consoleLogService.addItem(
			//   ConsoleLogItemType.info,
			//   sqlFormatter.format(q.getSql()),
			//   getCurrentLine().method
			// );

			q.update(update);
			let res = await q;

			console.log(res);
			return true;
		} catch (error) {
			return error;
		}
	}

	public async insertData(
		table: string,
		data: {
			[key: string]: any;
		}
	): Promise<boolean | Error> {
		try {
			let qRepo = this._appDataSource.getRepository(table);
			let query = qRepo.createQueryBuilder(table);

			// this.consoleLogService.addItem(
			//   ConsoleLogItemType.info,
			//   sqlFormatter.format(query.getSql()),
			//   getCurrentLine().method
			// );

			query.insert().into(table).values(data);

			let res = await query;

			console.log(res);
			return true;
		} catch (error) {
			return error;
		}
	}

	public async deleteData(
		table: string,
		where?: {
			column: string;
			opr: string;
			value: string;
			or: boolean;
		}[]
	): Promise<boolean | Error> {
		try {
			let qRepo = this._appDataSource.getRepository(table);
			let q: any = qRepo.createQueryBuilder(table);

			where.forEach((col, idx: number) => {
				if (idx == 0) {
					//q = q.where(col.column, col.opr, col.value, null);
				} else {
					let whereFunc = col.or ? 'orWhere' : 'andWhere';
					q = q[whereFunc](col.column, col.opr, col.value);
				}
			});

			// this.consoleLogService.addItem(
			//   ConsoleLogItemType.info,
			//   sqlFormatter.format(q.getSql()),
			//   getCurrentLine().method
			// );

			let res = await q.delete();
			console.log(res);
			return true;
		} catch (error) {
			return error;
		}
	}
}
