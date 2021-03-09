/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of, forkJoin } from 'rxjs';
import { take, map, concatMap, mergeMap, tap } from 'rxjs/operators';
import GlobalStore, { RoomState } from '../store/global_store';
import {
  MeetingCommon,
  ScreenCastEventType,
  ScreenCastRequestDTO,
  ScreenCastRequestType,
  ScreenCastEventDTO,
  ScreenCastStatus,
  ServiceType,
} from '@meeting/meeting-core';
import { desktopCapturer } from 'electron';

class ScreenCastVM {
  private static instance_: ScreenCastVM | null;

  public static getInstance(): ScreenCastVM {
    if (!this.instance_) {
      this.instance_ = new ScreenCastVM();
    }
    return this.instance_;
  }

  public static clear(): void {
    this.instance_ = null;
  }

  public initScreenCast(): Observable<void> {
    return of(GlobalStore.RoomStore.getData()).pipe(
      take(1),
      map((room_data: RoomState) => [
        this.onStarted(room_data.room_id),
        this.onEnded(room_data.room_id),
        this.onRequest(room_data.room_id),
        this.onResponse(room_data.room_id),
        this.onStatusChanged(room_data.room_id),
      ]),
      mergeMap((event_list: Array<Observable<void>>) => forkJoin(event_list)),
      map(() => console.log('screencast init success')),
    );
  }

  public startScreenCast(): Observable<string> {
    return of(GlobalStore.RoomStore.getData()).pipe(
      take(1),
      mergeMap((room_data: RoomState) => {
        const request_body = {
          request_type: ScreenCastRequestType.CREATE,
          data: {
            room_id: room_data.room_id,
          },
        }
        return this.desktopCapture(request_body);
      }),
      mergeMap((request_body: ScreenCastRequestDTO) => {
        console.warn("[startScreenCast] request_body: ", request_body);
        return MeetingCommon.GetInstance().sendRequest(
          ServiceType.SCREEN_CAST,
          request_body,
        );
      }),
      tap((room_id: string) => console.log('ScreenShare room id: ', room_id)),
    );
  }

  private async desktopCapture(request_body: ScreenCastRequestDTO) {
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });

    for (const source of sources) {
      if (source.name.includes('Electron')) {
        try {
          return {
            request_type: ScreenCastRequestType.CREATE,
            data: {
              room_id: request_body.data.room_id,
              constraint: {
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                  }
                }
              },
            },
          }
        } catch (e) {
          console.warn("error: ", e);
        }
      }
    }
    return request_body;
  }

  private onStarted(room_id: string): Observable<void> {
    console.warn("onStarted");
    return of({
      room_id: room_id,
      event_type: ScreenCastEventType.NOTIFY_SCREENCAST_STARTED,
      callback: this.onScreenCastStarted,
    }).pipe(
      take(1),
      mergeMap((screencast_started_event: ScreenCastEventDTO) =>
        MeetingCommon.GetInstance().addEventListener(
          ServiceType.SCREEN_CAST,
          screencast_started_event,
        ),
      ),
    );
  }

  private onScreenCastStarted(data: any): void {
    console.log('onScreenCastAdded: ', data);
    GlobalStore.VideoStroe.setVideo(data.stream);
  }

  private onEnded(room_id: string): Observable<void> {
    return of({
      room_id: room_id,
      event_type: ScreenCastEventType.NOTIFY_SCREENCAST_ENDED,
      callback: this.onScreenCastEnded,
    }).pipe(
      take(1),
      mergeMap((screencast_ended_event: ScreenCastEventDTO) =>
        MeetingCommon.GetInstance().addEventListener(
          ServiceType.SCREEN_CAST,
          screencast_ended_event,
        ),
      ),
    );
  }

  private onScreenCastEnded(data: any): void {
    console.log('onScreenCastEnded: ', data);
    GlobalStore.VideoStroe.setVideo(null);
  }

  private onRequest(room_id: string): Observable<void> {
    return of({
      room_id: room_id,
      event_type: ScreenCastEventType.REQUEST_START_SCREENCAST,
      callback: this.onScreenCastAsked,
    }).pipe(
      take(1),
      mergeMap((screencast_asked_event: ScreenCastEventDTO) =>
        MeetingCommon.GetInstance().addEventListener(
          ServiceType.SCREEN_CAST,
          screencast_asked_event,
        ),
      ),
    );
  }

  private onScreenCastAsked(data: any): void {
    console.log('onScreenCastAsked: ', data);
    data.accept();
  }

  private onResponse(room_id: string): Observable<void> {
    return of({
      room_id: room_id,
      event_type: ScreenCastEventType.RESPONSE_START_SCREENCAST,
      callback: this.onScreenCastAnswered,
    }).pipe(
      take(1),
      mergeMap((screencast_answer_event: ScreenCastEventDTO) =>
        MeetingCommon.GetInstance().addEventListener(
          ServiceType.SCREEN_CAST,
          screencast_answer_event,
        ),
      ),
    );
  }

  private onScreenCastAnswered(data: any): void {
    console.log('onScreenCastAnswered: ', data);
  }

  private onStatusChanged(room_id: string): Observable<void> {
    return of({
      room_id: room_id,
      event_type: ScreenCastEventType.NOTIFY_SCREENCAST_STATUS,
      callback: this.onScreenCastStatusChaneged,
    }).pipe(
      take(1),
      mergeMap((screencast_status_event: ScreenCastEventDTO) =>
        MeetingCommon.GetInstance().addEventListener(
          ServiceType.SCREEN_CAST,
          screencast_status_event,
        ),
      ),
    );
  }

  private onScreenCastStatusChaneged(status: ScreenCastStatus): void {
    console.log('onScreenCastStatusChaneged: ', status);
  }
}

export default ScreenCastVM;
