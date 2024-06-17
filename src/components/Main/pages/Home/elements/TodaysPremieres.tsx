import React from 'react';
import { Link } from 'react-router-dom'

function TodaysPremieres(props: {shows: Array<EpisodeWithShow>}){

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
          imgSrc = "/src/assets/img/Placeholder.png";
        }

        if (item.show.rating?.average){
          rating = item.show.rating.average;
        }else{
          noRating = "(not rated)";
        }

        return (
          <div key={item.id.toString()} className="today-episode-cnt">
            <Link to={`/info/${item.show.id}`}>
              <img className="today-episode-img" src={imgSrc} alt="Show Image"/><br/>
            </Link>
            <div className="today-ep-info-cnt">
              <button className="today-title show-title">
                <Link to={`/info/${item.show.id}`}>
                  {item.show.name}
                </Link>
              </button>
              <br/>
              <button className="today-title ep-title">
                <Link to={`/info/${item.show.id}/${item.season}/${item.number}`}>
                  {item.name}
                </Link>
              </button>
              <br/>
              <div className="today-ep-info">
              Airtime: {item.airtime}<br/>
              Rating: {rating}/10 {noRating}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <button className="more-shows">
      <Link to={'/shows'}>
        More shows &nbsp;&gt;&gt;
      </Link>
    </button>
    </> 
  );

}

export default TodaysPremieres;