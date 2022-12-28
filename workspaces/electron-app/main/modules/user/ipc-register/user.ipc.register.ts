import { ipcMain } from 'electron';

import { fluentProvide } from 'inversify-binding-decorators';
import { JsonValue } from 'type-fest';
import { IPCGetAllUsers, IPCUserInsert } from '../../../shared/ipc/user/user.ipc';
import { UserRepository } from '../repositories/user.repository';

@fluentProvide(UsersIPC).inSingletonScope().done()
export class UsersIPC {
  private _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  public listen() {
    ipcMain.handle(IPCUserInsert.CHANNEL, async (event, req: JsonValue) =>
      this._userRepository.Insert(req)
    );

    ipcMain.handle(
      IPCGetAllUsers.CHANNEL,
      async (event, req: JsonValue) => this._userRepository.getUsers(req)
    );
  }
}
