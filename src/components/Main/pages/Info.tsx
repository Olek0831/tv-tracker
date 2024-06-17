import React from 'react';
import { useState, useEffect } from 'react';
import ErrorHandler from '../elements/ErrorHandler';
import EpisodeTable from '../elements/EpisodeTable';
import DetailList from '../elements/DetailList';

function Info(props: {id: number, season?: number, episodeID?: number}){

  const [show, setShow] = useState<ShowWithEpisodes>();
  const [season, setSeason] = useState(props.season);
  const [episodeID, setEpisodeID] = useState(props.episodeID);
  const [errorCode, setErrorCode] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;

  function getShowInfo(){
    fetch("https://api.tvmaze.com/shows/"+props.id+"?embed=episodes", {signal})
    .then(res => {
      if (res.ok){
        return res.json();
      }else{
        return Promise.reject(res.status);
      }
    })
    .then((response: ShowWithEpisodes) => {
      setShow(response);
    })
    .catch(err => {
      setErrorCode(err);
    })
  }

  useEffect(() => {
    getShowInfo();

    return function cleanup(){
      controller.abort();
    }
  },[]);

  function handleTableClick(season: number, episodeID: number){
    setSeason(season);
    setEpisodeID(episodeID);
  }

  function backToShow(){
    setSeason(undefined);
    setEpisodeID(undefined);
  }

  if (show){
    const episodes = show._embedded.episodes;
    let renderTable;
    let renderInfo;
    let detailListComponent;
    let showName = <h2>{show.name}</h2>;

    if ((season) && (episodeID)){
      showName = <button className="back-to-show-btn" onClick={() => backToShow()}><h2>{show.name}</h2></button>
      episodes.forEach((episode: Episode) => {
        if ((episode.season === season) && (episode.number === episodeID)){

          let summary: JSX.Element | string;
          let runtime: JSX.Element | string;
          let imgSrc: string;

          if(episode.image?.medium){
            imgSrc = episode.image.medium;
          }else{
            imgSrc = "./src/assets/img/Placeholder.png";
          }

          if (episode.summary){
            summary = <div className="show-description" dangerouslySetInnerHTML={{__html: episode.summary}}/>;
          }else{
            summary = "";
          }

          if (episode.runtime){
            runtime = <li><b>Runtime:</b> {episode.runtime}</li>;
          }else{
            runtime = "";
          }

          renderInfo = {
            name: <h4>{episode.name}</h4>,
            image: <img className="info-img" src={imgSrc} alt="Episode Image"/>,
            header: "Episode Info",
            country: <li><b>Country:</b> {show.network.country.name}</li>,
            network: <li><b>Network:</b> <a href={show.officialSite}>{show.network.name}</a></li>,
            statusOrNumber: <li><b>Number:</b> Season {episode.season}, Episode {episode.number}</li>,
            typeOrAirdate: <li><b>Airdate:</b> {episode.airdate}</li>,
            airtime: <li><b>Airtime:</b> {episode.airtime}</li>,
            ratingOrRuntime: runtime,
            description: summary
          };
        }
      });
      renderTable = "";
    } else{
      let summary: JSX.Element | string;
      let rating: JSX.Element | string;
      let imgSrc: string;

      if(show.image?.medium){
        imgSrc = show.image.medium;
      }else{
        imgSrc = "./src/assets/img/Placeholder.png";
      }

      if (show.summary){
        summary = <div className="show-description" dangerouslySetInnerHTML={{__html: show.summary}}/>;
      }else{
        summary = "";
      }

      if(show.rating?.average){
        rating = <li><b>Rating:</b> {show.rating.average}/10</li>;
      }else{
        rating = "";
      }
      renderInfo = {
        name: "",
        image: <img className="info-img" src={imgSrc} alt="Show Image"/>,
        header: "Show Info",
        country: <li><b>Country:</b> {show.network.country.name}</li>,
        network: <li><b>Network:</b> <a href={show.officialSite}>{show.network.name}</a></li>,
        statusOrNumber: <li><b>Status:</b> {show.status}</li>,
        typeOrAirdate: <li><b>Show Type:</b> {show.type}</li>,
        genres: show.genres,
        ratingOrRuntime: rating,
        description: summary
      };
      renderTable = <EpisodeTable episodes={episodes} onClick={(season, episodeID) => handleTableClick(season, episodeID)}/>;
    }

    if(renderInfo){
      detailListComponent = <DetailList info = {renderInfo}/>
    }



    return (
      <div className="show-info main">
        {showName}
        {detailListComponent}
        {renderTable}
      </div> 
    );
  }else if(errorCode){
    return (
      <div className="Search main">
        <ErrorHandler errorCode={errorCode}/>
      </div>
    );
  }else{
    return (
      <div className="loader">
        <div className="loading-animation"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }
}

export default Info;