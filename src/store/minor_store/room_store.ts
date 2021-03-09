import StoreTemplate from '../store_util';

export type RoomState = {
  room_name: string;
  room_id: string;
  room_passwd: string;
  has_password: boolean | undefined;
  started_time: number | undefined;
  is_leader_joined: boolean | undefined;
  error: string;
};

class RoomStore extends StoreTemplate {
  constructor() {
    super({
      room_name: '',
      room_id: '',
      room_passwd: '',
      has_password: false,
      started_time: -1,
      error: '',
    });
  }

  public setRoomState(state: RoomState) {
    this.nextState(state);
  }

  public setRoomName(room_name: string): void {
    this.nextState({
      ...this.state_,
      room_name,
    });
  }

  public setRoomId(room_id: string): void {
    this.nextState({
      ...this.state_,
      room_id,
    });
  }

  public setRoomPasswd(room_passwd: string): void {
    this.nextState({
      ...this.state_,
      room_passwd,
    });
  }

  public setHasPassword(has_password: boolean): void {
    this.nextState({
      ...this.state_,
      has_password,
    });
  }

  public setStartedTime(started_time: number): void {
    this.nextState({
      ...this.state_,
      started_time,
    });
  }

  public setRoomStateError(error: string): void {
    this.nextState({
      ...this.state_,
      error,
    });
  }
}

const roomStore = new RoomStore();
export default roomStore;
