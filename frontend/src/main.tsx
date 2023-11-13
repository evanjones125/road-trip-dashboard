import React from 'react';
import ReactDOM from 'react-dom/client';
import App2 from './App2';
import { Provider } from 'react-redux';
import store from './store';
import './styles/styles.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App2 />
    </Provider>
  </React.StrictMode>
);
