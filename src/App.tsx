import React, { useEffect, useState, useRef} from 'react';
import './App.css';

function Banner(props: BannerProps){
  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button className="logo-btn" onClick={() => props.onClick(0)}>
          <img className="logo" src={require(".//img/TV Tracker.png")} alt="Logo"/>
        </button>
      </div>
      <div className="search-bar-cnt">
        <input 
          className="search-bar" 
          type="search" 
          value={props.searchValue} 
          onChange={(e) => props.onChange(e)}
          onKeyDown={(e) => props.onKeyDown(e)}
        />
        <button className="search-btn" onClick={() => props.onClick(1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="10" cy="10" r="7" />
            <line x1="21" y1="21" x2="15" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Navigation(props: {onClick:(i:number)=>void}){
  return(
    <div className="Navigation">
      <button className="nav-btn nav-home-btn" onClick={() => props.onClick(0)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-home" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <polyline points="5 12 3 12 12 3 21 12 19 12" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
      </button>
      <button className="nav-btn" onClick={() => props.onClick(2)}>Shows</button>
      <button className="nav-btn" onClick={() => props.onClick(3)}>Calendar</button>
    </div>
  )
}

function Header(props: BannerProps){
  return(
    <div className="Header">
      <Banner onClick={(i) => props.onClick(i)} searchValue={props.searchValue} onChange={(e) => props.onChange(e)} onKeyDown={(e) => props.onKeyDown(e)}/>
      <Navigation onClick={(i) => props.onClick(i)}/>
    </div>
  );
}

function TodaysPremieres(props: {moreShows: ()=>void, details: (id: number)=>void}){

  interface Episode {
    show: {
      rating: {
        average: number;
      }
      name: string;
      type: string;
    }
    airdate: string;
    airtime: string;
  }

  const [todaySchedule, setTodaySchedule] = useState<Array<Episode>>([]);
  const [fullTodaySchedule, setFullTodaySchedule] = useState<Array<Episode>>([]);

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
    fetch("https://api.tvmaze.com/schedule?date="+date)
    .then(res => {
      return res.json();
    })
    .then(schedule => {
      setFullTodaySchedule(schedule);
      const scheduleSortedByRating = schedule.sort((a: Episode, b: Episode) => {
        return b.show.rating.average - a.show.rating.average;
      });

      let todayShowsByRating: Episode[] = [];
      
      scheduleSortedByRating.forEach((element: Episode) => {
        if (element.show.rating.average > 0 && element.airdate === date && element.show.type === "Scripted" && element.airtime > "19:00"){
          todayShowsByRating.push(element);
        }
      });
      setTodaySchedule(todayShowsByRating.slice(0, 5));
    });
  }

  function renderFullSch(ep: Array<Episode>){

    let airtimesArray: Array<string> = [];

    ep.forEach((element: Episode) => {
      if (!airtimesArray.includes(element.airtime) && element.airdate === date){
        airtimesArray.push(element.airtime);
      }
    })

    airtimesArray.sort();

    return(
      <>
        {airtimesArray.map((time, i) => {
          return(
            <div>
              <h3>{time}</h3>
              {ep.map((episode, j) => {
                if (episode.airtime === time){
                  return (
                    <>
                      {episode.show.name}<br/>
                    </>
                  )
                }
              })}
            </div>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    getTodaySchedule()
  },[]);

  return(
    
    <>
    <h2>Best shows airing tonight</h2>
    <div className="todays-premieres">
      {todaySchedule && todaySchedule.length>0 && todaySchedule.map((item: any, i: number)=>{
        return (
          <div className="today-episode-cnt">
            <img src={item.show.image.medium} alt=""/><br/>
            {item.show.name}<br/>
            {item.name}<br/>
            {item.airtime}<br/>
            {item.show.rating.average}<br/>
            <button onClick={() => props.details(item.show.id)}>Details</button>
          </div>
        )
      })}
      <p><button onClick={() => props.moreShows()}>More shows &nbsp; &gt;&gt;</button></p>
    </div>
    <div className="today-full">
      <h2>Full schedule for today</h2>
      {fullTodaySchedule && fullTodaySchedule.length>0 && renderFullSch(fullTodaySchedule)}
    </div>
    </>
    
  )

}

function Home(props: {moreShows: ()=>void, details: (id: number)=>void}){

   return(
    <div className="Home main">
      <TodaysPremieres moreShows={() => props.moreShows()} details={(id) => props.details(id)}/>
    </div>
  )

}

function Search(props: {toSearch: string}){

  const[searchResults, setSearchResults] = useState<Array<{}>>([]);

  const getSearchResults=()=>{
    fetch("https://api.tvmaze.com/search/shows?q="+props.toSearch)
    .then(res => {
      return res.json();
    })
    .then(results => {
      setSearchResults(results);
    });
  }

  useEffect(() => {
    getSearchResults()
  },[props.toSearch]);

  return (
    <div className="Search main">
      {searchResults && searchResults.length>0 && searchResults.map((item: any) => {
        return (
          <div className="search-episode-cnt">
          <img src={item.show?.image?.medium} alt="no image"/><br/>
          {item.show?.name}<br/>
          </div>
        )
      })}
    </div>
  );

}

function Filter(props: FilterProps){

  return (
    <div className="filter-bar">
      <select value={props.genre} onChange={(e) => props.onGenreChange(e)}>
        {genres.map((item) => {
          return <option value={item.value}>{item.value}</option>
        })}
      </select>
      <select value={props.type} onChange={(e) => props.onTypeChange(e)}>
        {types.map((item) => {
          return <option value={item.value}>{item.value}</option>
        })}
      </select>
      <select value={props.status} onChange={(e) => props.onStatusChange(e)}>
        {statuses.map((item) => {
          return <option value={item.value}>{item.value}</option>
        })}
      </select>
      <select value={props.language} onChange={(e) => props.onLanguageChange(e)}>
        {languages.map((item) => {
          return <option value={item.value}>{item.value}</option>
        })}
      </select>
      <select value={props.country} onChange={(e) => props.onCountryChange(e)}>
        {countries.map((item) => {
          return <option value={item.value}>{item.value}</option>
        })}
      </select>
      <button onClick={() => props.onClick()}>Filter</button>
    </div>
  );
}

function Pagination(props: {page: number, addButtons: number, onClick: (i: number)=>void}){

  const currentPage: number = (props.page+1);
  let buttons: number;
  let addedButtons: number;

  if (props.addButtons<0){
     addedButtons = 0;
  }else{
     addedButtons = props.addButtons;
  }

  if(currentPage<=5){
    buttons = currentPage + addedButtons;
  }else{
    buttons = addedButtons + 5;
  }

  function renderButton(i: number){
    if (i===currentPage){
      return <button className="pagination-button-active">{i}</button>;
    }else{
      return <button className="pagination-button" onClick={() => props.onClick(i-1)}>{i}</button>;
    }
  }

  return(
    <div className="pagination-cnt">
      {Array(buttons).fill(null).map((item, i) => {
        if (currentPage<=5){
          return renderButton(i+1);
        }else{
          return renderButton((currentPage-4)+i);
        }
      })}
    </div>
  );
}

function Shows(props: {}){

  const [showsPage, setShowsPage] = useState(0);
  const [showsToShow, setShowsToShow] = useState<Array<{}>>([]);
  const [buttons, setButtons] = useState(0);
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: genre,
    type: type,
    status: status,
    language: language,
    country: country
  }); 

  const abort = new AbortController();
  const signal = abort.signal;
  let listPage = useRef<Array<number>>([0]);
  let firstIndex = useRef<Array<number>>([0]);
  let showsArray: Array<{}> = [];

  function updateFilters(){
    setLoading(true);
    const filtersObj = {
      genre: genre,
      type: type,
      status: status,
      language: language,
      country: country
    }

    setFilters(filtersObj);
    setShowsPage(0);
  }

  function handleGenre(e: React.ChangeEvent<HTMLSelectElement>){
    setGenre(e.target.value);
  }

  function handleType(e: React.ChangeEvent<HTMLSelectElement>){
    setType(e.target.value);
  }

  function handleStatus(e: React.ChangeEvent<HTMLSelectElement>){
    setStatus(e.target.value);
  }

  function handleLanguage(e: React.ChangeEvent<HTMLSelectElement>){
    setLanguage(e.target.value);
  }

  function handleCountry(e: React.ChangeEvent<HTMLSelectElement>){
    setCountry(e.target.value);
  }

  function handlePagination(i: number){
    setLoading(true);
    setShowsPage(i);
  }

  function loader(){
    if (loading === true){
      return (
        <p>Loading...</p>
      )
    }else if(showsToShow.length === 0){
      return (
        <p>No matches</p>
      )
    }else {
      return (
        <div className="shows-main">
          {showsToShow && showsToShow.length>0 && showsToShow.map((item: any) => {
            return (
              <div className="show-cnt">
                <img src={item.image?.medium} alt="no image"/><br/>
                {item.name}<br/>
              </div>
            );
          })}
          <Pagination page={showsPage} addButtons={buttons} onClick={(i) => handlePagination(i)}/>
        </div>
      )
    }
  }

  function applyFilters({genres, type, status, language, country}: Filters){
    let g: boolean, t: boolean, s: boolean, l: boolean, c: boolean;
    if ((filters.genre !== "" && genres.includes(filters.genre)) ||(filters.genre === "")){
      g = true;
    } else{
      g = false;
    }
    if ((filters.type !== "" && filters.type === type)||(filters.type === "")){
      t = true;
    } else{
      t = false;
    }
    if ((filters.status !== "" && filters.status === status)||(filters.status === "")){
      s = true;
    } else{
      s = false;
    }
    if ((filters.language !== "" && filters.language === language)||(filters.language === "")){
      l = true;
    } else{
      l = false;
    }
    if ((filters.country !== "" && filters.country === country)||(filters.country === "")){
      c = true;
    } else{
      c = false;
    }

    if (g && t && s && l && c){
      return true;
    }else{
      return false;
    }
  }

  function getShowList(page: number, index: number){
    fetch("https://api.tvmaze.com/shows?page="+page, {signal})
    .then(res => {
      if (res.ok){
        return res.json();
      }else{
        return Promise.reject();
      }
    })
    .then(response => {
      const showList = response;
      for(let i = index; showsArray.length<125; i++){
        if(showList[i] !== undefined){
          if(applyFilters(showList[i])){
            showsArray.push(showList[i]);
            switch(showsArray.length){
              case(25):
                listPage.current[showsPage+1] = page;
                firstIndex.current[showsPage+1] = i+1;
                break;
              case(50):
                listPage.current[showsPage+2] = page;
                firstIndex.current[showsPage+2] = i+1;
                break;
              case(75):
                listPage.current[showsPage+3] = page;
                firstIndex.current[showsPage+3] = i+1;
                break;
              case(100):
                listPage.current[showsPage+4] = page;
                firstIndex.current[showsPage+4] = i+1;
                break;
              case(125):
                listPage.current[showsPage+5] = page;
                firstIndex.current[showsPage+5] = i+1;
                break;
            }
          }
        }
        else{
          break;
        }
      }
      if (showsArray.length<125){
        getShowList(page+1, 0);
      }else{
        setShowsToShow(showsArray.slice(0, 25));
        setButtons(Math.floor((showsArray.length - 1)/25));
        setLoading(false);
      }
    })
    .catch(err => {
      setShowsToShow(showsArray.slice(0, 25));
      setButtons(Math.floor((showsArray.length-1)/25));
      setLoading(false);
    })
  }

  useEffect(() => {
    getShowList(listPage.current[showsPage], firstIndex.current[showsPage]);

    return function cleanup(){
      abort.abort();
    }
  }, [showsPage, filters]);

  return(
    <div className="Shows main">
      {loader()}
      <Filter 
        genre={genre} 
        type={type}
        status={status}
        language={language}
        country={country}
        onGenreChange={(e) => handleGenre(e)}
        onTypeChange={(e) => handleType(e)}
        onStatusChange={(e) => handleStatus(e)}
        onLanguageChange={(e) => handleLanguage(e)}
        onCountryChange={(e) => handleCountry(e)}
        onClick={() => updateFilters()}
      />
      <br/>
    </div>
  );
}

function Calendar(props: {}){

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

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [schedule, setSchedule] = useState<Array<Array<{}>>>([[]]);

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

  async function getSchedule(){
    let scheduleList: Array<Array<{}>> = [];
    let dataArray: Array<{}> = [];
    let monthRaw = currentMonth;
    
    for(let i = 0; i<daysArray.length; i++){
      let day: string | number;
      let month: string | number;
      let year = currentYear

      if(monthRaw === 0){
        month = 12;
        year = year - 1;
      }

      if(daysArray[i] === 1){
        monthRaw = monthRaw + 1;
      }

      if (monthRaw === 13){
        month = 1;
        year = year + 1;
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

      const date = year+"-"+month+"-"+day

      const response = await fetch("https://api.tvmaze.com/schedule?date="+date);
      const data = await response.json();
      data.map((item: {airdate: string, show: {type: string}}) => {
        if (item.show.type === "Scripted" && item.airdate === date){
          dataArray.push(item);
        }
      })
      scheduleList[i] = dataArray;
      dataArray = [];
    }
    setSchedule(scheduleList);
  }

  useEffect(() => {
    getSchedule();
  }, [currentMonth]);

  return (
    <div className="Calendar main">
      <table className="calendar-table">
        <tr>
          <td>
            <button onClick={() => handlePrev()}>Prev</button>
          </td>
          <th colSpan={5}>{months[currentMonth]} {currentYear}</th>
          <td>
            <button onClick={() => handleNext()}>Next</button>
          </td>
        </tr>
        <tr>
          {days.map((item) => {
            return <th>{item}</th>;
          })}
        </tr>
        {Array(Math.floor((daysArray.length/7)+1)).fill(null).map((item, i) => {
          return (
            <tr>
              {daysArray.slice(i*7, (i*7)+7).map((day, j) => {
                return(
                  <td className="day">
                    {day}<br/>
                    {schedule[j+(i*7)] && schedule.length>0 && schedule[j+(i*7)].map((show: any) => {
                      return (
                        <>
                          {show.show.name} <br/>
                        </>
                      )
                    })}
                  </td>
                );
              })}
            </tr>
          )
        })}
      </table>
    </div>
  );

}

function ShowInfo(props: {id: number}){

  const [show, setShow] = useState<any>();

  function getShowInfo(){
    fetch("https://api.tvmaze.com/shows/"+props.id+"?embed=episodes")
    .then(res => {
      if (res.ok){
        return res.json();
      }
    })
    .then(response => {
      setShow(response);
    })
    
  }

  useEffect(() => {
    getShowInfo();
  },[]);

  if (show){
    return(
      <div className="show-info main">
        <h1>{show.name}</h1>
        <img src={show.image.medium} alt="no image"/><br/>
        {show.genres.map((item:any)=> {
          return (
            <>
              {item}<br/>
            </>
          )
        })}
        {show.officialSite}<br/>
        {show.rating.average}
        <div dangerouslySetInnerHTML={{__html: show.summary}}/>
        <div>
          {[...show._embedded.episodes].reverse().map((episode:any) => {
            return (
              <>
                {episode.name} | {episode.airdate}<br/>
              </>
            )
          })}
        </div>
      </div>
    )
  }else{
    return <div></div>
  }
}

function Main(props: MainProps){

  const currentState = props.currentState;
  const stateList = props.stateList;

  switch (currentState) {
    case (stateList[0]) :
      return <Home moreShows={() => props.moreShows()} details={(id) => props.details(id)}/>;
    case (stateList[1]) :
      return <Search toSearch={props.toSearch}/>;
    case (stateList[2]) :
      return <Shows/>;
    case (stateList[3]) :
      return <Calendar/>;
    case(stateList[4]) :
      return <ShowInfo id={props.ID}/>;
    default:
      return <Home moreShows={() => props.moreShows()} details={(id) => props.details(id)}/>;
  }

}

function App() {

  const stateList: Array<string> = ["home", "search", "shows", "calendar", "showInfo"];
  const [mainState, setMainState] = useState(stateList[0]);
  const [searchValue, setSearchValue] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showId, setShowID] = useState<number>(0);

  function handleClick(i: number){
    setToSearch(searchValue);
    setMainState(stateList[i]);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
    setSearchValue(e.target.value);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.key === "Enter"){
      setToSearch(searchValue);
      setMainState(stateList[1]);
    }
  }

  function handleMoreShows(){
    setMainState(stateList[2]);
  }

  function handleDetails(id: number){
    setShowID(id);
    setMainState(stateList[4]);
  }

  return (
    <div className="App">
      <Header 
        onClick={(i) => handleClick(i)} 
        searchValue={searchValue} 
        onChange={(e) => handleSearch(e)} 
        onKeyDown={(e) => handleEnter(e)}
      />
      <Main 
        currentState={mainState} 
        stateList={stateList} 
        toSearch={toSearch} 
        moreShows={() => handleMoreShows()}
        ID={showId}
        details={(id) => handleDetails(id)}
      />
    </div>
  );
}

interface MainProps {
  currentState: string,
  stateList: Array<string>, 
  toSearch: string, 
  moreShows: ()=>void,
  ID: number
  details:(id: number) => void
}

interface BannerProps {
  onClick:(i:number)=>void,
  searchValue: string, 
  onChange:(e: React.ChangeEvent<HTMLInputElement>) => void,
  onKeyDown:(e: React.KeyboardEvent<HTMLInputElement>) => void
};

interface FilterProps {
  genre: string,
  type: string,
  status: string,
  language: string,
  country: string,
  onGenreChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onClick: ()=>void
}

interface Filters{
  genres: Array<string>,
  type: string,
  status: string,
  language: string,
  country: string
}

const genres = [
  {value: ""},
  {value: "Action"},
  {value: "Adult"},
  {value: "Adventure"},
  {value: "Anime"},
  {value: "Children"},
  {value: "Comedy"},
  {value: "Crime"},
  {value: "DIY"},
  {value: "Drama"},
  {value: "Espionage"},
  {value: "Family"},
  {value: "Fantasy"},
  {value: "Food"},
  {value: "History"},
  {value: "Horror"},
  {value: "Legal"},
  {value: "Medical"},
  {value: "Music"},
  {value: "Mystery"},
  {value: "Nature"},
  {value: "Romance"},
  {value: "Science-Fiction"},
  {value: "Sports"},
  {value: "Supernatural"},
  {value: "Thriller"},
  {value: "Travel"},
  {value: "War"},
  {value: "Western"}
];

const types = [
  {value: ""},
  {value: "Scripted"},
  {value: "Animation"},
  {value: "Reality"},
  {value: "Talk Show"},
  {value: "Documentary"},
  {value: "Game Show"},
  {value: "News"},
  {value: "Sports"},
  {value: "Variety"},
  {value: "Award Show"},
  {value: "Panel Show"}
];

const statuses = [
  {value: ""},
  {value: "Running"},
  {value: "Ended"},
  {value: "To Be Determined"},
  {value: "In Development"},
];

const languages = [
  {value: ""},
  {value: "Afrikaans"},
  {value: "Albanian"},
  {value: "Arabic"},
  {value: "Armenian"},
  {value: "Azerbaijani"},
  {value: "Basque"},
  {value: "Belarusian"},
  {value: "Bengali"},
  {value: "Bosnian"},
  {value: "Bulgarian"},
  {value: "Catalan"},
  {value: "Chechen"},
  {value: "Chinese"},
  {value: "Croatian"},
  {value: "Czech"},
  {value: "Danish"},
  {value: "Divehi"},
  {value: "Dutch"},
  {value: "English"},
  {value: "Estonian"},
  {value: "Finnish"},
  {value: "French"},
  {value: "Galician"},
  {value: "Georgian"},
  {value: "German"},
  {value: "Greek"},
  {value: "Gujarati"},
  {value: "Hebrew"},
  {value: "Hindi"},
  {value: "Hungarian"},
  {value: "Iceland"},
  {value: "Indonesian"},
  {value: "Irish"},
  {value: "Italian"},
  {value: "Japanese"},
  {value: "Javanese"},
  {value: "Kannada"},
  {value: "Kazakh"},
  {value: "Kongo"},
  {value: "Korean"},
  {value: "Latin"},
  {value: "Latvian"},
  {value: "Lithuanian"},
  {value: "Luxembourgish"},
  {value: "Malay"},
  {value: "Malayalam"},
  {value: "Marathi"},
  {value: "Mongolian"},
  {value: "Norwegian"},
  {value: "Panjabi"},
  {value: "Pashto"},
  {value: "Persian"},
  {value: "Polish"},
  {value: "Portuguese"},
  {value: "Romanian"},
  {value: "Russian"},
  {value: "Serbian"},
  {value: "Sinhalese"},
  {value: "Slovak"},
  {value: "Slovenian"},
  {value: "Spanish"},
  {value: "Swedish"},
  {value: "Tagalog"},
  {value: "Tamil"},
  {value: "Telugu"},
  {value: "Thai"},
  {value: "Turkish"},
  {value: "Ukrainian"},
  {value: "Urdu"},
  {value: "Uzbek"},
  {value: "Vietnamese"},
  {value: "Welsh"},
  {value: "Scottish Gaelic"}
];

const countries = [
  {value: ""},
  {value: "Afghanistan"},
  {value: "Albania"},
  {value: "Algeria "},
  {value: "Argentina"},
  {value: "Armenia"},
  {value: "Australia"},
  {value: "Austria"},
  {value: "Azerbaijan"},
  {value: "Bangladesh"},
  {value: "Belarus"},
  {value: "Belgium"},
  {value: "Bosnia and Herzegovina"},
  {value: "Brazil"},
  {value: "Bulgaria"},
  {value: "Canada"},
  {value: "Chile"},
  {value: "China"},
  {value: "Colombia"},
  {value: "Croatia"},
  {value: "Cyprus"},
  {value: "Czech Republic"},
  {value: "Denmark"},
  {value: "Egypt"},
  {value: "Estonia"},
  {value: "Faroe Islands"},
  {value: "Finland"},
  {value: "France"},
  {value: "French Polynesia"},
  {value: "Georgia"},
  {value: "Germany"},
  {value: "Greece"},
  {value: "Hong Kong"},
  {value: "Hungary"},
  {value: "Iceland"},
  {value: "India"},
  {value: "Indonesia"},
  {value: "Iran, Islamic Republic of"},
  {value: "Iraq"},
  {value: "Ireland"},
  {value: "Israel"},
  {value: "Italy"},
  {value: "Japan"},
  {value: "Kazakhstan"},
  {value: "Korea, Democratic People's Republic of"},
  {value: "Korea, Republic of"},
  {value: "Latvia"},
  {value: "Lebanon"},
  {value: "Lithuania"},
  {value: "Luxembourg"},
  {value: "Malaysia"},
  {value: "Maldives"},
  {value: "Mexico"},
  {value: "Moldova, Republic of"},
  {value: "Mongolia"},
  {value: "Netherlands"},
  {value: "New Zealand"},
  {value: "Nigeria"},
  {value: "Norway"},
  {value: "Pakistan"},
  {value: "Peru"},
  {value: "Philippines"},
  {value: "Poland"},
  {value: "Portugal"},
  {value: "Puerto Rico"},
  {value: "Qatar"},
  {value: "Romania"},
  {value: "Russian Federation"},
  {value: "Saudi Arabia"},
  {value: "Serbia"},
  {value: "Singapore"},
  {value: "Slovakia"},
  {value: "Slovenia"},
  {value: "South Africa"},
  {value: "Spain"},
  {value: "Sri Lanka"},
  {value: "Sweden"},
  {value: "Switzerland"},
  {value: "Taiwan, Province of China"},
  {value: "Thailand"},
  {value: "Trinidad and Tobago"},
  {value: "Tunisia"},
  {value: "Turkey"},
  {value: "Ukraine"},
  {value: "United Arab Emirates"},
  {value: "United Kingdom"},
  {value: "United States"},
  {value: "Uzbekistan"},
  {value: "Venezuela, Bolivarian Republic of"},
  {value: "Viet Nam"}
];

export default App;