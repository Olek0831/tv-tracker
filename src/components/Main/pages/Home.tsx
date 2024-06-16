import React from 'react';
import { useState, useEffect } from 'react';
import TodaysPremieres from '../elements/TodaysPremieres';
import FullSchedule from '../elements/FullSchedule';
import ErrorHandler from '../elements/ErrorHandler';

function Home(props: {moreShows: ()=>void, details: (id: number, season?: number, episodeID?: number)=>void}){

  const [todaySchedule, setTodaySchedule] = useState<Array<EpisodeWithShow>>([]);
  const [fullTodaySchedule, setFullTodaySchedule] = useState<Array<EpisodeWithShow>>([]);
  const [errorCode, setErrorCode] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;

  const today = new Date();
  const monthRaw = (today.getMonth()+1);
  let month: string;
  const dayRaw = today.getDate();
  let day: string;
  
  if (monthRaw < 10){
    month = monthRaw.toString();
    month = '0'+month;
  } else{
    month = monthRaw.toString();
  }

  if (dayRaw < 10){
    day = dayRaw.toString();
    day = '0'+day;
  } else{
    day = dayRaw.toString();
  }

  const date = today.getFullYear()+'-'+month+'-'+day;

  const getTodaySchedule=()=>{
    fetch("https://api.tvmaze.com/schedule?date="+date, {signal})
    .then(res => {
      if(res.ok){
        return res.json();
      }else{
        return Promise.reject(res.status);
      }
    })
    .then((schedule: Array<EpisodeWithShow>) => {
      setFullTodaySchedule(schedule);
      const scheduleSortedByRating = schedule.sort((a: EpisodeWithShow, b: EpisodeWithShow) => {
        if (b.show.rating?.average && a.show.rating?.average){
          return b.show.rating.average - a.show.rating.average;
        } else if(!(b.show.rating?.average) && a.show.rating?.average){
          return -(a.show.rating.average);
        }else if(b.show.rating?.average && !(a.show.rating?.average)){
          return b.show.rating.average;
        }else{
          return 0;
        }
      });
      let todayShowsByRating: EpisodeWithShow[] = [];
      
      scheduleSortedByRating.forEach((element: EpisodeWithShow) => {
        if (element.show.rating?.average && element.airdate === date && element.airtime && element.airtime > "19:00"){
          todayShowsByRating.push(element);
        }
      });
      setTodaySchedule(todayShowsByRating.slice(0, 5));
    })
    .catch(err => {
      setErrorCode(err);
    })
  }

  useEffect(() => {
    getTodaySchedule();

    return function cleanup(){
      controller.abort();
    } 
  },[]);

  if(!(errorCode)){
    return(
      <div className="Home main">
        <TodaysPremieres shows={todaySchedule} moreShows={() => props.moreShows()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>
        <div className="today-full">
          <h2 className="today-header">Full schedule for today</h2>
          {fullTodaySchedule && fullTodaySchedule.length>0 && <FullSchedule ep={fullTodaySchedule} date={date} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>}
        </div>
      </div>
    )
  }else{
    return(
      <div className="Home main">
        <ErrorHandler errorCode={errorCode}/>
      </div>
    )
  }
};

export default Home;