import GlobalStore from '../store/global_store';
import { generateRandomId, generateRandomName } from '../util/random';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MeetingCommon,
  UserRequestDTO,
  UserRequestType,
  UserCreateReturnType,
  ServiceType,
} from '@meeting/meeting-core';

class UserVM {
  private static instance_: UserVM | null;

  public static getInstance(): UserVM {
    if (!this.instance_) {
      this.instance_ = new UserVM();
    }
    return this.instance_;
  }

  public static clear(): void {
    this.instance_ = null;
  }

  public setUserAuthority(authority: string): void {
    GlobalStore.UserStore.setUserAuthority(authority);
  }

  public setUserName(user_name: string | void): void {
    if (!user_name) {
      user_name = generateRandomName();
    }
    GlobalStore.UserStore.setUserName(user_name);
  }

  public setUserId(user_id: string | void): void {
    if (!user_id) {
      user_id = generateRandomId();
    }
    GlobalStore.UserStore.setUserId(user_id);
  }

  public getUserDataFromCore(): Observable<void> {
    const user_request_body: UserRequestDTO = {
      request_type: UserRequestType.CREATE, // join Room의 역할에 해당합니다.
      data: {},
    };

    return from(
      MeetingCommon.GetInstance().sendRequest(
        ServiceType.USER,
        user_request_body,
      ),
    ).pipe(
      map((user_core_data: UserCreateReturnType) => {
        console.warn('user create data: ', user_core_data);
        // user_core_data.meeting_start_time // go to scheduler
        GlobalStore.UserStore.setUserJointime(user_core_data.user_join_time);
      }),
    );
  }
}

export default UserVM;
