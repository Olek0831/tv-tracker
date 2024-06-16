import React from 'react';
import { useState, useEffect } from 'react';
import CalendarLoader from '../elements/CalendarLoader';

function Calendar(props: {details: (id: number, season?: number, episodeID?: number) => void}){

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [schedule, setSchedule] = useState<Array<Array<EpisodeWithShow>>>([[]]);
  const [loading, setLoading] = useState(true);

  const controller = new AbortController();
  const signal = controller.signal;
  const firstOfMonth = new Date(currentYear, currentMonth, 1);

  let firstDayRaw = (firstOfMonth.getDay()-1);

  if (firstDayRaw === -1){
    firstDayRaw = 6;
  }

  let daysArray: Array<number> = [];
  let currentDay = new Date(firstOfMonth);

  if (firstDayRaw > 0){
    currentDay.setDate(-(firstDayRaw-1));
  }

  let lastOfMonth = new Date(firstOfMonth);
  lastOfMonth.setMonth(firstOfMonth.getMonth()+1);

  for(; currentDay<lastOfMonth; currentDay.setDate(currentDay.getDate()+1)){
    daysArray.push(currentDay.getDate());
  }

  if ((daysArray.length%7) !== 0){
    for(let i=1; (daysArray.length%7) !== 0; i++){
      daysArray.push(i);
    }
  }

  function handlePrev(){
    setLoading(true);
    let monthControl = currentMonth;
    let yearControl = currentYear;

    monthControl = monthControl - 1;
    if (monthControl === -1){
      monthControl = 11;
      yearControl = yearControl - 1;
    }
    setCurrentYear(yearControl);
    setCurrentMonth(monthControl);
  }

  function handleNext(){
    setLoading(true);
    let monthControl = currentMonth;
    let yearControl = currentYear;

    monthControl = monthControl + 1;
    if (monthControl === 12){
      monthControl = 0;
      yearControl = yearControl + 1;
    }
    setCurrentYear(yearControl);
    setCurrentMonth(monthControl);
  }

  async function getSchedule(isFetching: boolean){
    let scheduleList: Array<Array<EpisodeWithShow>> = [];
    let dataArray: Array<EpisodeWithShow> = [];
    let monthRaw = currentMonth;
    let yearRaw = currentYear;

    if (isFetching){
    
      for(let i = 0; i<daysArray.length; i++){
        let day: string | number;
        let month: string | number;
        let year: number;
        

        if(monthRaw === 0){
          monthRaw = 12;
          yearRaw = yearRaw - 1;
        }

        if(daysArray[i] === 1){
          monthRaw = monthRaw + 1;
        }

        if (monthRaw === 13){
          monthRaw = 1;
          yearRaw = yearRaw + 1;
        }

        if (monthRaw < 10){
          month = "0"+monthRaw;
        }else{
          month = monthRaw;
        }

        if (daysArray[i]<10){
          day = "0"+daysArray[i];
        }else{
          day = daysArray[i];
        } 

        year = yearRaw;

        const date = year+"-"+month+"-"+day

        const response = await fetch("https://api.tvmaze.com/schedule?date="+date, {signal});
        const data: Array<EpisodeWithShow> = await response.json();
        data.map((item: EpisodeWithShow) => {
          if (item.show.type === "Scripted" && item.airdate === date){
            dataArray.push(item);
          }
        })
        scheduleList[i] = dataArray;
        dataArray = [];
      }
    }
    setSchedule(scheduleList);
    setLoading(false);
  }

  useEffect(() => {
    let isFetching = true;
    getSchedule(isFetching);

    return function cleanup(){
      isFetching = false;
      controller.abort()
    }
  }, [currentMonth]);

  return (
    <div className="Calendar main">
      <CalendarLoader loading = {loading} currentMonth={currentMonth} currentYear={currentYear} schedule={schedule} daysArr = {daysArray} onPrev={() => handlePrev()} onNext={() => handleNext()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>
    </div>
  );

}

export default Calendar;