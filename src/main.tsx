import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
import Home from './components/Main/pages/Home/Home.tsx';
import Shows from './components/Main/pages/Shows/Shows.tsx';
import Calendar from './components/Main/pages/Calendar/Calendar.tsx';
import Info from './components/Main/pages/Info/Info.tsx';
import Search from './components/Main/pages/Search/Search.tsx';
import './styles/style.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "shows",
        element: <Shows />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'info/:showID/:seasonID?/:episodeID?',
        element: <Info />
      },
      {
        path: 'search/:searchQuery',
        element: <Search />
      }
    ]
  },
]);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <RouterProvider router={router} />
);