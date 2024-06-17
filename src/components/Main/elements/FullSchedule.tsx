import React from 'react';

function FullSchedule(props: {ep: Array<EpisodeWithShow>, date: string, details: (id: number, season?: number, episodeID?: number)=>void}){

  let airtimesArray: Array<string> = [];

  props.ep.forEach((element: EpisodeWithShow) => {
    if (element.airtime && !airtimesArray.includes(element.airtime) && element.airdate === props.date){
      airtimesArray.push(element.airtime);
    }
  })

  airtimesArray.sort();

  return(
    <table className="full-sch-table">
      {airtimesArray.map((time) => {
        return(
          <tbody key={time}>
            <tr>
              <th className="full-sch-header">{time}</th>
            </tr>
          {props.ep.map((episode: EpisodeWithShow) => {
            if (episode.airtime === time){
              return (
                <tr key={episode.id.toString()}>
                  <td className="full-sch-data">
                    <button className="full-sch-show-name" onClick={() => props.details(episode.show.id)}>
                      {episode.show.name}
                    </button>
                    <br/>
                    <button className="full-sch-ep-name" onClick={() => props.details(episode.show.id, episode.season, episode.number)}>
                      {episode.name}
                    </button>
                  </td>
                </tr>
              )
            }
          })}
          </tbody>
        );
      })}
    </table>  
  );
}

export default FullSchedule;