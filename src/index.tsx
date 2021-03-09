import React from 'react';
import { render } from 'react-dom';
import './index.css';
import PageRouter from './view/page_router';

render(
    <React.StrictMode>
        <PageRouter />
    </React.StrictMode>,
    document.getElementById('root')
);
