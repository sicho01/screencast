import {
  DEFAULT_APPSERVER_URL,
  DEFAULT_REMOTE_IMAGE,
} from '../constant/common_constants';
import { MeetingCommon } from '@meeting/meeting-core';
/*
import localStreamStore, {
  LocalStreamState,
} from './minor_store/local_stream_store';
import remoteStreamStore, {
  RemoteStreamState,
} from './minor_store/remote_stream_store';
import optionStore, { OptionState } from './minor_store/option_store';
import accountStore, { AccountState } from './minor_store/account_store';
*/
import roomStore, { RoomState } from './minor_store/room_store';
import userStore from './minor_store/user_store';
import videoStroe, { VideoState } from './minor_store/video_store';

MeetingCommon.GetInstance();
MeetingCommon.Init(
  DEFAULT_APPSERVER_URL,
  DEFAULT_REMOTE_IMAGE,
  DEFAULT_REMOTE_IMAGE,
);

const GlobalStore = {
  RoomStore: roomStore,
  UserStore: userStore,
  VideoStroe: videoStroe,
};

export default GlobalStore;

export type {
  RoomState,
  VideoState,
  /*LocalStreamState,
  RemoteStreamState,
  OptionState,
  AccountState,*/
};
