import React, {useEffect, useState} from 'react';
import './App.css';

interface mainProp{
  stateList: Array<string>;
  currentState: string;
}

function Banner(){
  return(
    <div className="Banner">
      <div className="logo-cnt">abc</div>
      <div className="search-cnt">
        <input type="search"/>
        <button>szukaj</button>
      </div>
    </div>
  )
}

function Navigation(){
  return(
    <div className="Navigation">
    </div>
  )
}

function Header(){
  return(
    <div className="Header">
      <Banner/>
      <Navigation/>
    </div>
  );
}

function Home(){

  const[data, setData] = useState([]);

  const getTodaySchedule=()=>{
    fetch("https://api.tvmaze.com/schedule/web?date=2022-03-24",
   /* {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }*/)
    .then(res => {
      return res.json();
    })
    .then(schedule => {
      console.log(schedule);
      setData(schedule) 
    });
  }

  useEffect(() => {
    getTodaySchedule()
  },[]);

  return(
    <div className="Home">
      {data && data.length>0 && data.map((item: any)=><p>{item.name} {item.airdate} {item.airtime}</p>)}
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

function Main(props: mainProp){

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

  return (
    <div className="App">
      <Header/>
      <Main currentState={mainState} stateList={stateList} />
    </div>
  );
}

export default App;
