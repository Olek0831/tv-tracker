import React from "react";
import { Link } from "react-router-dom";

function CalendarLoader(props: {loading: boolean, currentMonth: number, currentYear: number, daysArr: number[], schedule: Array<Array<EpisodeWithShow>>, onPrev: () => void, onNext: () => void}){
 
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  let prevMonth = props.currentMonth - 1;
  let nextMonth = props.currentMonth + 1;

  if (prevMonth === - 1){
    prevMonth = 11;
  }

  if (nextMonth === 12){
    nextMonth = 0;
  }
 
  if (props.loading){
    return (
      <div className="loader">
        <div className="loading-animation"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }else{
    return(
      <>
      <h2>Monthly Calendar</h2>
      <div className="month-cnt">
        <div className="cal-prev-btn-cnt">
          <button className="cal-prev-btn" onClick={() => props.onPrev()}>&laquo;&nbsp;{months[prevMonth]}</button>
        </div>
        <div className="month">{months[props.currentMonth]} {props.currentYear}</div>
        <div className="cal-next-btn-cnt">
          <button className="cal-next-btn" onClick={() => props.onNext()}>{months[nextMonth]}&nbsp;&raquo;</button>
        </div>
      </div>
      <div className="calendar-table">
        <div className="table-row day-names">
          {days.map((item) => {
            return (
              <div key={item} className="table-header">
                <div className="day-name-widescreen">{item}</div>
              </div>
            );
          })}
        </div>
        {Array(Math.floor((props.daysArr.length/7)+1)).fill(null).map((_item: null, i) => {
          return (
            <div key={i} className="table-row">
              {props.daysArr.slice(i*7, (i*7)+7).map((day, j) => {
                return <RenderDay key={day} day={day} i={i} j={j} days={days} schedule={props.schedule}/>;
              })}
            </div>
          )
        })}
      </div>
      </>
    )
  }
}

function RenderDay(props: {day: number, i: number, j:number, days: string[], schedule: Array<Array<EpisodeWithShow>>}){
 
  const today = new Date();

  let ordinal: string;

  if ((props.day === 1) || (props.day === 21) || (props.day === 31)){
    ordinal = "st";
  }else if ((props.day === 2) || (props.day === 22)){
    ordinal = "nd";
  }else if((props.day === 3) || (props.day === 23)){
    ordinal = "rd";
  }else{
    ordinal = "th";
  }

  return(
    <div className={(today.getDate() === props.day) ? "table-cell day today" : "table-cell day"}>
      <div className={(today.getDate() === props.day) ? "day-number-cnt today" : "day-number-cnt"}>
        <div className="day-name-mobile">
          {props.days[props.j]},&nbsp;
        </div>
        {props.day}{ordinal}
        <br/>
      </div>
      {props.schedule[props.j+(props.i*7)] && props.schedule.length>0 && props.schedule[props.j+(props.i*7)].map((episode: EpisodeWithShow) => {
        return (
          <div key={episode.id} className="cal-data">
            <button className="cal-show-name-btn">
              <Link to={`/info/${episode.show.id}`} >
                {episode.show.name}
              </Link>
            </button>
            <br/>
            <button className="cal-episode-name-btn">
              <Link to={`/info/${episode.show.id}/${episode.season}/${episode.number}`} >
                {episode.name}
              </Link>
            </button>
            <br/>
          </div>
        )
      })}
    </div>
  )
}

export default CalendarLoader;