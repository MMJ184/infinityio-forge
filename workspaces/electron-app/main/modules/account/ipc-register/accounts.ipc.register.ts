import 'reflect-metadata';
import { fluentProvide } from 'inversify-binding-decorators';
import { JsonValue } from 'type-fest';
import { AccountRepository } from '../repositories/account.repository';
import { ipcMain } from 'electron';
import { IPCAccountsInsert } from '../../../shared/ipc/accounts.ipc';

@fluentProvide(AccountsIPC).inSingletonScope().done()
export class AccountsIPC {
  private _accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this._accountRepository = accountRepository;
  }

  public listen() {
    ipcMain.handle(IPCAccountsInsert.CHANNEL, async (event, req: JsonValue) =>
      this._accountRepository.Insert(req)
    );
  }
}
