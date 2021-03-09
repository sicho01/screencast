/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useRef, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { of, fromEvent, Subscription, Observable } from 'rxjs';
import { first, filter, map, take, mergeMap } from 'rxjs/operators';
import RoomVM from '../../view_model/room_vm';
import UserVM from '../../view_model/user_vm';
import ScreenCastVM from '../../view_model/screen_cast_vm';
import LandingPresenter from '../presenter/landing_view_presenter';

function initDefaultValue(): Subscription {
  const subs = of(RoomVM.getInstance().isNotInit())
    .pipe(
      first(),
      filter((is_not_inited: boolean) => !is_not_inited),
      map(() => UserVM.getInstance().setUserName()),
      map(() => RoomVM.getInstance().setRoomName('test')), // default room name})
    )
    .subscribe(
      () => console.log('data init success.'),
      (error) => console.warn('initDefaultValue error: ', error),
    );
  return subs;
}

function onMeetingStart(
  start_button: React.MutableRefObject<any>,
): Observable<void> {
  return fromEvent(start_button.current as any, 'click').pipe(
    take(1),
    mergeMap(() => RoomVM.getInstance().getRoomDataFromCore()),
    mergeMap(() => ScreenCastVM.getInstance().initScreenCast()),
    mergeMap(() => UserVM.getInstance().getUserDataFromCore()),
  );
}

function LandingContainer(): ReactElement {
  const start_button = useRef<HTMLButtonElement>(null);
  const history = useHistory();

  useLayoutEffect(() => {
    const init_sub = initDefaultValue();
    const start_sub = onMeetingStart(start_button).subscribe(
      () => {
        console.warn('Enter Meeting success: ');
        history.push('/main');
      },
      (error) => {
        console.warn('Enter Meeting failed ', error);
      },
    );
    return () => {
      start_sub?.unsubscribe();
      init_sub?.unsubscribe();
    };
  }, []);

  return <LandingPresenter button_ref={start_button} />;
}

export default LandingContainer;
