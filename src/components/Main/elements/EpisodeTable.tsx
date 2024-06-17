import React from "react";

function EpisodeTable(props: {episodes: Array<Episode>, onClick:(season: number, episodeID: number)=>void}){
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
              <button className="episode-name-btn" onClick={() => props.onClick(episode.season, episode.number)}>
                {episode.name}
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