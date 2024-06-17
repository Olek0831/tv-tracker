import React from 'react';

function TodaysPremieres(props: {shows: Array<EpisodeWithShow>, moreShows: ()=>void, details: (id: number, season?: number, episodeID?: number)=>void}){

  let imgSrc: string;
  let rating: number = 0;
  let noRating: string = "";
  

  return(
    <>
    <h2 className="today-header">Best shows airing tonight</h2>
    <div className="todays-premieres">
      {props.shows && props.shows.length>0 && props.shows.map((item: EpisodeWithShow)=>{

        if(item.show.image?.medium){
          imgSrc = item.show.image.medium;
        }else{
          imgSrc = "./src/assets/img/Placeholder.png";
        }

        if (item.show.rating?.average){
          rating = item.show.rating.average;
        }else{
          noRating = "(not rated)";
        }

        return (
          <div key={item.id.toString()} className="today-episode-cnt">
            <img className="today-episode-img" src={imgSrc} onClick={() => props.details(item.show.id)} alt="Show Image"/><br/>
            <div className="today-ep-info-cnt">
              <button className="today-title show-title" onClick={() => props.details(item.show.id)}>{item.show.name}</button><br/>
              <button className="today-title ep-title" onClick={() => props.details(item.show.id, item.season, item.number)}>{item.name}</button><br/>
              <div className="today-ep-info">
              Airtime: {item.airtime}<br/>
              Rating: {rating}/10 {noRating}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <button className="more-shows" onClick={() => props.moreShows()}>More shows &nbsp;&gt;&gt;</button>
    </> 
  );

}

export default TodaysPremieres;