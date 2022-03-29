import React, { useEffect, useState} from 'react';
import './App.css';

function Banner(props: {onClick:(i:number)=>void}){
  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button className="logo" onClick={() => props.onClick(0)}>home</button>
      </div>
      <div className="search-cnt">
        <input type="search"/>
        <button onClick={() => props.onClick(1)}>szukaj</button>
      </div>
    </div>
  )
}

function Navigation(props: {onClick:(i:number)=>void}){
  return(
    <div className="Navigation">
      <button onClick={() => props.onClick(0)}>home</button>
      <button onClick={() => props.onClick(2)}>calendar</button>
    </div>
  )
}

function Header(props: {onClick:(i:number)=>void}){
  return(
    <div className="Header">
      <Banner onClick={(i) => props.onClick(i)}/>
      <Navigation onClick={(i) => props.onClick(i)}/>
    </div>
  );
}

function TodaysPremieres(){

  interface Rating {
    show: {
      rating: {
        average: number;
      }
    }
    airdate: string;
  }

  const[todaySchedule, setTodaySchedule] = useState<Array<Rating>>([]);

  const today = new Date();
  let monthRaw = (today.getMonth()+1);
  let month: string;
  
  if (monthRaw < 10){
    month = monthRaw.toString();
    month = '0'+month;
  } else{
    month = monthRaw.toString();
  }

  const date = today.getFullYear()+'-'+month+'-'+today.getDate();

  const getTodaySchedule=()=>{
    fetch("https://api.tvmaze.com/schedule?date="+date)
    .then(res => {
      return res.json();
    })
    .then(schedule => {
      const scheduleSortedByRating = schedule.sort((a: Rating, b: Rating) => {
        return b.show.rating.average - a.show.rating.average;
      });

      let todayShowsByRating: Rating[] = [];
      
      scheduleSortedByRating.forEach((element: Rating) => {
        if (element.show.rating.average > 0 && element.airdate == date){
          todayShowsByRating.push(element);
        }
      });
      setTodaySchedule(todayShowsByRating.slice(0, 5));
    });
  }

  useEffect(() => {
    getTodaySchedule()
  },[]);

  return(
    <div className="todays-premieres">
      {todaySchedule && todaySchedule.length>0 && todaySchedule.map((item: any, i: number)=>{
        let epClass: string = "today-episode-cnt"+i;
        return (
          <div className={epClass}>
            <img src={item.show.image.medium}/><br/>
            {item.show.name}<br/>
            {item.name}<br/>
            {item.airtime}<br/>
            {item.show.rating.average}
          </div>
        )
      })}
    </div>
  )

}

function Home(){

    return(
      <div className="Home">
        <TodaysPremieres/>
      </div>
    )

}

function Search(){

  return (
    <div className="Search"></div>
  );

}

function Calendar(){

  return (
    <div className="Calendar"></div>
  );

}

function Main(props: {currentState: string, stateList: Array<string>}){

  const currentState = props.currentState;
  const stateList = props.stateList;

  switch (currentState) {
    case (stateList[0]) :
      return <Home/>;
    case (stateList[1]) :
      return <Search/>;
    case (stateList[2]) :
      return <Calendar/>;
    default:
      return <Home/>;
  }

}

function App() {

  const stateList: Array<string> = ["home", "search", "calendar"];
  const [mainState, setMainState] = useState(stateList[0]);

  function handleClick(i: number){
    setMainState(stateList[i]);
  }

  return (
    <div className="App">
      <Header onClick={i => handleClick(i)}/>
      <Main currentState={mainState} stateList={stateList} />
    </div>
  );
}

export default App;
