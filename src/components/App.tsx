import React from 'react';
import { useState } from 'react'
import Main from './Main/Main.tsx';
import Header from './Header/Header.tsx';

function App() {

  const stateList: Array<string> = ["home", "search", "shows", "calendar", "info"];
  const [mainState, setMainState] = useState(stateList[0]);
  const [searchValue, setSearchValue] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showId, setShowID] = useState(0);
  const [season, setSeason] = useState<number>();
  const [episodeID, setEpisodeID] = useState<number>();

  function handleClick(i: number){
    setToSearch(searchValue);
    setMainState(stateList[i]);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
    setSearchValue(e.target.value);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.key === "Enter"){
      setToSearch(searchValue);
      setMainState(stateList[1]);
    }
  }

  function handleMoreShows(){
    setMainState(stateList[2]);
  }

  function handleDetails(id: number, season?: number, episodeID?: number){
    setShowID(id);

    if(season){
      setSeason(season);
    }else{
      setSeason(undefined);
    }

    if(episodeID){
      setEpisodeID(episodeID);
    }else{
      setEpisodeID(undefined);
    }

    setMainState(stateList[4]);
  }

  return (
    <div className="App">
      <Header 
        onClick={(i) => handleClick(i)} 
        searchValue={searchValue} 
        onChange={(e) => handleSearch(e)} 
        onKeyDown={(e) => handleEnter(e)}
      />
      <Main 
        currentState={mainState} 
        stateList={stateList} 
        toSearch={toSearch} 
        moreShows={() => handleMoreShows()}
        ID={showId}
        season={season}
        episodeID={episodeID}
        details={(id, season?, episodeID?) => handleDetails(id, season, episodeID)}
      />
    </div>
  );
}

export default App;