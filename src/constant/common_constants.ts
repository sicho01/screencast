//import REMOTE_IMAGE from '../resource/png/Profile_empty_quit.png';
//import REMOTE_IMAGE from '../resource/gif/dancing_teemo.gif';
const { REMOTE_IMAGE } = require('../logo.svg');
export const DEFAULT_APPSERVER_URL =
  'https://dev.hypermeeting.biz/restapi/v1.1'; // */
//export const DEFAULT_APPSERVER_URL = 'https://stage.hypermeeting.biz/restapi/v1.1';
//export const DEFAULT_APPSERVER_URL = 'https://222.122.67.218/restapi';
export const DEFAULT_REMOTE_IMAGE = REMOTE_IMAGE;

export enum LocalStreamType {
  LOCAL = 1,
  FAKE = 2,
}

export enum StreamingType {
  GRID_FIRST_PAGE = 'RECEIVE_GRID_PAGE',
  SUBSCRIBE_N = 'RECEIVE_N_STREAM',
  SUBSCRIBE_POWER_OF_N = 'RECEIVE_POWER_OF_N_STREAM',
  NO_SUBSCRIBE = 'NO_RECEIVE',
}

export type UserStream = {
  stream: MediaStream;
  user_id: string;
};
