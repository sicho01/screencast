import StoreTemplate from '../store_util';

class UserStore extends StoreTemplate {
  constructor() {
    super({
      user_name: '',
      user_id: '',
      user_authority: '',
      user_join_time: 0,
      user_count: 0,
      error: '',
    });
  }

  public setUserName(user_name: string): void {
    this.nextState({
      ...this.state_,
      user_name,
    });
  }

  public setUserId(user_id: string): void {
    this.nextState({
      ...this.state_,
      user_id,
    });
  }

  public setUserAuthority(authority: string): void {
    this.nextState({
      ...this.state_,
      user_authority: authority,
    });
  }

  public setUserJointime(user_join_time: number): void {
    this.nextState({
      ...this.state_,
      user_join_time,
    });
  }

  public setUserCount(user_count: number): void {
    this.nextState({
      ...this.state_,
      user_count,
    });
  }
}

const userStore = new UserStore();
export default userStore;
