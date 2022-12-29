import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import App from './components/App';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import SearchResult from "./components/SearchResult";
import DeckView from "./components/DeckView";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="searchResult" element={<SearchResult />} />
          <Route path="deckView/:id" element={<DeckView />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
);


