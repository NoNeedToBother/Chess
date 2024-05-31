import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {UserState} from "./context/UserContext";
import {Data} from "./context/DataContext";
import {ChessState} from "./context/ChessContext";
import {ChessService} from "./data/service/ChessService";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const chessService = new ChessService();
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <UserState>
              <ChessState chess={ chessService }>
                  <Data>
                      <App/>
                  </Data>
              </ChessState>
          </UserState>
      </BrowserRouter>
  </React.StrictMode>
);
