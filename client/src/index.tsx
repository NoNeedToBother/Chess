import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {UserState} from "./context/UserContext";
import {Data} from "./context/DataContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Data>
              <UserState>
                  <App/>
              </UserState>
          </Data>
      </BrowserRouter>
  </React.StrictMode>
);
