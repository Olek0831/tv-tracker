import React, {MouseEventHandler, useEffect, useState} from 'react';
import { createNoSubstitutionTemplateLiteral, TypeOfTag } from 'typescript';
import './App.css';

interface mainProp{
  stateList: Array<string>;
  currentState: string;
}

function Banner(props: {onClick:(i:number)=>void}){
  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button onClick={() => props.onClick(0)}>home</button>
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

function Home(){

  const[data, setData] = useState([]);

  const getTodaySchedule=()=>{
    fetch("https://api.tvmaze.com/schedule?date=2022-03-24")
    .then(res => {
      return res.json();
    })
    .then(schedule => {
      setData(schedule) 
    });
  }

  useEffect(() => {
    getTodaySchedule()
  },[]);

  return(
    <div className="Home">
      {data && data.length>0 && data.map((item: any)=><p>{item.show.name} {item.airdate} {item.airtime}</p>)}
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
