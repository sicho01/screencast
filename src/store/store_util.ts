/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { of, Observable, Subject, Subscription } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import GlobalStore from './global_store';

class StoreTemplate {
  protected state_: any;
  protected subject_ = new Subject();

  readonly initial_state: any;
  constructor(initial_state: any) {
    this.initial_state = initial_state;
    this.state_ = this.initial_state;
  }

  public init(setState: any): Subscription {
    const subs = this.subject_.subscribe(setState);
    this.state_ = {
      ...this.state_,
      error: '',
    };
    this.subject_.next(this.state_);
    return subs;
  }

  public getData(): any {
    return this.state_;
  }

  public clear(): void {
    this.state_ = this.initial_state;
    this.subject_.next(this.state_);
  }

  protected subscribe(onNext: any): Subscription {
    return this.subject_.subscribe(onNext);
  }

  protected nextState(state: any): void {
    this.state_ = state;
    this.subject_.next(state);
  }
}

export default StoreTemplate;

export function clearStore(): Observable<any> {
  return of(1).pipe(
    first(),
    tap(() => GlobalStore.UserStore.clear()),
    tap(() => GlobalStore.RoomStore.clear()),
  );
}
