import React from "react";

function DetailList(props: {info: Info}){

  let genres;

  if ((props.info.genres) && (props.info.genres.length)){
    const length = props.info.genres.length - 1;
    genres = <li>
                <b>Genres:</b> {props.info.genres.map((item: string, i: number) => {
                  if (i === length){
                    return (
                      <span key={item}>
                        {item}
                      </span>
                    );
                  }else{
                    return (
                      <span key={item}>
                        {item} |&nbsp;
                      </span>
                    );
                  }
                })}
              </li>
  }else{
    genres = "";
  }

  return (
    <>
    {props.info.name}
    <div className="info-cnt">
      {props.info.image}
      <div className="detailed-info-cnt">
        <ul>
          <li className="list-header">
            {props.info.header}
          </li>
          {props.info.country}
          {props.info.network}
          {props.info.statusOrNumber}
          {props.info.typeOrAirdate}
          {props.info.genres ? genres : props.info.airtime}
          {props.info.ratingOrRuntime}
        </ul>
      </div>
    </div>
    {props.info.description}
    </>
  )
}

export default DetailList;