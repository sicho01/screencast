import React, { ReactElement } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import LandingContainer from './container/landing_view_container';
import MainContainer from './container/main_view_container';

function PageRouter(): ReactElement {
  console.warn("PageRouter");
  return (
    <BrowserRouter>
      <Route path="/" component={LandingContainer} />
      <Route path="/main" component={MainContainer} />
    </BrowserRouter>
  );
}

export default PageRouter;
