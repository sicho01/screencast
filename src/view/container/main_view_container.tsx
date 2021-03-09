/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  ReactElement,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { fromEvent, Observable } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import RoomVM from '../../view_model/room_vm';
import ScreenCastVM from '../../view_model/screen_cast_vm';
import { clearStore } from '../../store/store_util';
import MainPresenter from '../presenter/main_view_presenter';
import GlobalStore from '../../store/global_store';

function onMeetingEnd(
  home_button: React.MutableRefObject<any>,
): Observable<void> {
  return fromEvent(home_button.current as any, 'click').pipe(
    take(1),
    mergeMap(() => RoomVM.getInstance().endMeeting()),
    mergeMap(() => clearStore()), // store data 초기화
  );
}

function MainContainer(): ReactElement {
  const home_button = useRef<HTMLButtonElement>(null);
  const screen_cast_video = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState(
    GlobalStore.VideoStroe.initial_state,
  );

  const history = useHistory();

  useLayoutEffect(() => {
    const video_store_sub = GlobalStore.VideoStroe.init(setVideoState);
    const screen_cast_sub = ScreenCastVM.getInstance()
      .startScreenCast()
      .subscribe((room_id: string) => {
        console.warn('screencast room id: ', room_id);
      });

    const button_sub = onMeetingEnd(home_button).subscribe(
      (room_state: any) => {
        console.warn('get room success: ', room_state);
        history.push('/');
      },
      (error) => {
        console.warn('meeting end failed ', error);
      },
    );

    return () => {
      button_sub?.unsubscribe();
      screen_cast_sub?.unsubscribe();
      video_store_sub?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!screen_cast_video.current) {
      return;
    }

    screen_cast_video.current.srcObject = videoState.video;

    return () => {
      if (screen_cast_video?.current) {
        screen_cast_video.current.srcObject = null;
      }
    };
  }, [videoState.video]);

  return (
    <MainPresenter video_ref={screen_cast_video} button_ref={home_button} />
  );
}

export default MainContainer;
