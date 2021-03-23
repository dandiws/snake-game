import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App gridSize={[30,30]} intervalTime={100} />
  </React.StrictMode>,
  document.getElementById('root')
);