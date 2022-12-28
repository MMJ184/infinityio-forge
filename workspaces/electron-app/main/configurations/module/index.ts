import { AccountsIPC } from '../../modules/account/ipc-register/accounts.ipc.register';
import { QueriesIPC } from '../../modules/other/ipc-register/queries.ipc.register';
import { ViewsIPC } from '../../modules/other/ipc-register/views.ipc.register';
import { UsersIPC } from '../../modules/user/ipc-register/user.ipc.register';
import { logger } from '../../shared/helper/logger.helper';
import container from './ioc';

export class BackendMain {
  private accountsIPC: AccountsIPC;
  private viewsIPC: ViewsIPC;
  private queriesIPC: QueriesIPC;
  private userIPC: UsersIPC;

  constructor() {
    this.accountsIPC = container.get<AccountsIPC>(AccountsIPC);
    this.viewsIPC = container.get<ViewsIPC>(ViewsIPC);
    this.queriesIPC = container.get<QueriesIPC>(QueriesIPC);
    this.userIPC = container.get<UsersIPC>(UsersIPC);
  }

  public listen(): void {
    this.accountsIPC.listen();
    this.viewsIPC.listen();
    this.queriesIPC.listen();
    this.userIPC.listen();

    logger.info('IPC listener set.');
  }
}
