/* eslint-disable @typescript-eslint/no-explicit-any */
import GlobalStore, { RoomState } from '../store/global_store';
import { DEFAULT_APPSERVER_URL } from '../constant/common_constants';
import { from, Observable, of, iif } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';
import {
  MeetingCommon,
  ServiceType,
  RoomRequestDTO,
  RoomRequestType,
  MeetingConstant,
  RoomDataReturnType,
  MeetingErrorCode,
} from '@meeting/meeting-core';
import { generateRandomId } from '../util/random';

class RoomVM {
  private static instance_: RoomVM | null;

  public static getInstance(): RoomVM {
    if (!this.instance_) {
      this.instance_ = new RoomVM();
    }
    return this.instance_;
  }

  public static clear(): void {
    this.instance_ = null;
  }

  public isNotInit(): boolean {
    const room_data = GlobalStore.RoomStore.getData();
    return !!room_data.room_name;
  }

  public setRoomName(room_name: string): void {
    GlobalStore.RoomStore.setRoomName(room_name);
  }

  public setRoomId(room_id: string): void {
    GlobalStore.RoomStore.setRoomId(room_id);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setError(error: any): any {
    if (error.getErrorCode() === MeetingErrorCode.NO_SUCH_ROOM)
      GlobalStore.RoomStore.setRoomStateError('NO_SUCH_ROOM');
    else {
      console.warn('get Room From Core failed ', error);
      GlobalStore.RoomStore.setRoomStateError(error.message);
    }
    return error;
  }

  public getRoomDataFromCore(): Observable<RoomState> {
    const room_data = GlobalStore.RoomStore.getData() as RoomState;
    const request_body: RoomRequestDTO = this.generateCreateRoomBody();

    const exist_room_data_source = of(room_data).pipe(
      first(),
      tap(() => console.warn('???')),
    );
    const get_room_data_source = from(
      MeetingCommon.GetInstance().sendRequest(ServiceType.ROOM, request_body),
    ).pipe(
      map((core_room_data: RoomDataReturnType) => {
        return {
          ...room_data,
          room_id: core_room_data.room_id,
          started_time: core_room_data.started_time,
          has_password: core_room_data.has_password,
          is_leader_joined: core_room_data.is_leader_joined,
        }; // map to ui's room state
      }),
      map((room_state: RoomState) => {
        GlobalStore.RoomStore.setRoomState(room_state);
        return room_state;
      }),
    );

    return iif(
      () => room_data.started_time !== -1,
      exist_room_data_source,
      get_room_data_source,
    );
  }

  public endMeeting(): Observable<void> {
    const request_body: RoomRequestDTO = {
      request_type: RoomRequestType.DELETE,
      data: {},
    };

    return from(
      MeetingCommon.GetInstance().sendRequest(ServiceType.ROOM, request_body),
    ).pipe(
      map(() => {
        MeetingCommon.Clear();
      }),
    );
  }

  private generateCreateRoomBody(): RoomRequestDTO {
    const room_data = GlobalStore.RoomStore.getData();
    const user_data = GlobalStore.UserStore.getData();

    const request_body = {
      request_type: RoomRequestType.CREATE,
      data: {
        user_id: user_data.user_id ? user_data.user_id : generateRandomId(),
        user_name: user_data.user_name,
        server_url: DEFAULT_APPSERVER_URL,
      },
    };
    if (!room_data.room_id) {
      (request_body.data as any).room_name = room_data.room_name;
      (request_body.data as any).authority =
        user_data.user_authority !== ''
          ? MeetingConstant.RoomAuthorityType.UNLIMITED
          : MeetingConstant.RoomAuthorityType.LIMITED;
      console.log('create room!: ', request_body);
    } else {
      (request_body.data as any).room_id = room_data.room_id;
      console.log('join room!');
    }

    return request_body;
  }
}

export default RoomVM;
