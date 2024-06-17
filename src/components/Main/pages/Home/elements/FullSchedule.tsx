import React from 'react';
import { Link } from 'react-router-dom';

function FullSchedule(props: {ep: Array<EpisodeWithShow>, date: string}){

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
                    <button className="full-sch-show-name">
                      <Link to={`/info/${episode.show.id}`}>
                        {episode.show.name}
                      </Link>
                    </button>
                    <br/>
                    <button className="full-sch-ep-name">
                      <Link to={`/info/${episode.show.id}/${episode.season}/${episode.number}`}>
                        {episode.name}
                      </Link>
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