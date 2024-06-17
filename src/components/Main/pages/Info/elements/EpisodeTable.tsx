import React from "react";
import { Link } from 'react-router-dom';

function EpisodeTable(props: {episodes: Array<Episode>}){
  return (
    <>
    <h2>Episode List</h2>
      <div className="episodes-cnt">
        <div className="episode-name episodes-header">Episode Name</div>
        <div className="episode-airdate episodes-header">Airdate</div>
      </div>
      {[...props.episodes].reverse().map((episode: Episode) => {
        return (
          <div className="episode-row" key={episode.id}>
            <div className="episode-name">
              <button className="episode-name-btn">
                <Link to={`${episode.season}/${episode.number}`} >
                  {episode.name}
                </Link>
              </button>
            </div>
            <div className="episode-airdate">
              {episode.airdate}
            </div>
          </div>
          )
        })}
    </>
  )
}

export default EpisodeTable;