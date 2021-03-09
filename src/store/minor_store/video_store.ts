import StoreTemplate from '../store_util';

export type VideoState = {
  video: MediaStream | null;
};

class VideoStore extends StoreTemplate {
  constructor() {
    super({
      video: null,
      error: '',
    });
  }

  public setVideo(video: MediaStream | null): void {
    this.nextState({
      ...this.state_,
      video,
    });
  }
}

const videoStore = new VideoStore();
export default videoStore;
