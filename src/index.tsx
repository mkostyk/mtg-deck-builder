import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import './index.css';
import App from './components/App';
import Login from "./components/Login";
import Register from "./components/Register";
import SearchResult from "./components/DeckSearchResult";
import CardSearchResult from "./components/CardSearchResult";
import DeckView from "./components/DeckView";
import {CardSearch} from './components/CardSearch';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
);


