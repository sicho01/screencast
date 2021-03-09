/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react';
import '../../App.css';

type Props = {
  video_ref: React.MutableRefObject<any>;
  button_ref: React.MutableRefObject<any>;
};

function Main_View({ video_ref, button_ref }: Props): ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <video ref={video_ref} width={640} height={480} autoPlay />
        </div>
        <button ref={button_ref} type="button">
          {' '}
          Go to Home
        </button>
      </header>
    </div>
  );
}

export default Main_View;
