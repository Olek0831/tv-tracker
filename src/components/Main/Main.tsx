import React from 'react';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import Shows from './pages/Shows.tsx';
import Calendar from './pages/Calendar.tsx';
import Info from './pages/Info.tsx';

function Main(props: MainProps){

  const currentState = props.currentState;
  const stateList = props.stateList;

  switch (currentState) {
    case (stateList[0]) :
      return <Home moreShows={() => props.moreShows()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
    case (stateList[1]) :
      return <Search toSearch={props.toSearch} details={(id) => props.details(id)}/>;
    case (stateList[2]) :
      return <Shows details={(id) => props.details(id)}/>;
    case (stateList[3]) :
      return <Calendar details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
    case(stateList[4]) :
      return <Info id={props.ID} season={props.season} episodeID={props.episodeID}/>;
    default:
      return <Home moreShows={() => props.moreShows()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
  }

}

export default Main;