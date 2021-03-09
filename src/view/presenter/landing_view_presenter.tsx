import React, { ReactElement } from 'react';
import '../../App.css';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  button_ref: React.MutableRefObject<any>;
};

function LandingPresenter({ button_ref }: Props): ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <button ref={button_ref} type="button">
          {' '}
          Meeting Start
        </button>
      </header>
    </div>
  );
}

export default LandingPresenter;
