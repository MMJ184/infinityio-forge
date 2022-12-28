import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WindowApiConst } from 'shared-lib';
import { UsersIPCService } from 'src/app/services/ipc/user.service';
import { ElectronIpcService } from '../../services/electron-ipc.service';

@Component({
	selector: 'app-multiples',
	templateUrl: './multiples.component.html',
	styleUrls: ['./multiples.component.scss'],
})
export class MultiplesComponent implements OnInit {
	// Users: UserDT[] = [];
	// limit: number = 0;
	// offset: number = 0;
	// tableDataSource: any[] = [];
	// pagerConfig: PagerConfig;
	// tableConfig: TableConfig[] = (UserTableConfig as any).default;
	// tableRowActions: TableRowActions[] = [];
	// searchDataSource: any = {};
	// searchConfig: SearchConfig[] = [];
	// filterData: any = {};
	// subscriptions = new Subscription();

	timesTableForm = new UntypedFormGroup({
		input: new FormControl<number>(Math.round(Math.random() * 100) % 10, {
			nonNullable: true,
		}),
	});

	multiples: number[] = [];

	constructor(
		public usersIPCService: UsersIPCService,
		private router: Router,
		private electronIpc: ElectronIpcService,
		private translate: TranslateService
	) {}

	ngOnInit(): void {
		// Specifying what to do with received data from main process
		this.electronIpc.receive<number[]>(
			WindowApiConst.MULTIPLES_OUTPUT,
			(output: number[]) => {
				// Update current data
				this.multiples = output;
			}
		);

		// Reset multiples on form changes
		this.timesTableForm.valueChanges.subscribe(() => {
			this.multiples = [];
		});

		// Init time tables with given random value
		// this.onSubmit();
	}

	translateIn(lang: string): void {
		this.translate.use(lang);
	}

	onSubmit(): void {
		this.getAllUsers();
		const input = this.timesTableForm.value.input;
		
	}

	async getAllUsers() {
		var response = await this.usersIPCService.getUsers(
			'user',
			[],
			10,
			0,
			[],
			'',
			[],
			// [
			//   {
			//     column: 'firstName',
			//     opr: IPCReadData.IIPCReadDataWhereOpr.EQ,
			//     value: 'InfinityIo',
			//     or: false,
			//   },
			// ],
			[],
			[]
		);

		console.log(JSON.parse(JSON.stringify(response.data)));

		// this.usersIPCService.rowCount = response.count;

		// this.setTableData();
		// this.usersIPCService.setPager();
		// this.pagerConfig = this.usersIPCService.pagerConfig;
	}

	// setTableData() {
	// 	this.tableDataSource = this.Users.map((user) => {
	// 		return {
	// 			button: {
	// 				color: '', //project.account.accountUser.color,
	// 				url: 'assets/icon/hierarchy.svg',
	// 			},
	// 			btnFavoriteIcon: {
	// 				isFavorite: false,
	// 				url: 'assets/icon/unfavorite.svg',
	// 			},
	// 			id: user.id,
	// 			firstName: user.firstName,
	// 			lastName: user.lastName,
	// 			email: user.email,
	// 			phone: user.phone,
	// 			address: user.address,
	// 			gender: user.gender,

	// 			// clientAccountId: user.clientAccountId,
	// 			// projectManager: this.parseProjectManager(user.projectUsers),
	// 			// relationTypes: this.parseRelationType(user.projectUsers),
	// 			// stateType: [user.stateType]
	// 		};
	// 	});
	// }
}
