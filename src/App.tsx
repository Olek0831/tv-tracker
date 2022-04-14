import React, { useEffect, useState} from 'react';
import './App.css';

function Banner(props: BannerProps){
  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button className="logo" onClick={() => props.onClick(0)}>home</button>
      </div>
      <div className="search-bar-cnt">
        <input 
          className="search-bar" 
          type="search" 
          value={props.searchValue} 
          onChange={(e) => props.onChange(e)}
          onKeyDown={(e) => props.onKeyDown(e)}
        />
        <button onClick={() => props.onClick(1)}>szukaj</button>
      </div>
    </div>
  )
}

function Navigation(props: {onClick:(i:number)=>void}){
  return(
    <div className="Navigation">
      <button onClick={() => props.onClick(0)}>home</button>
      <button onClick={() => props.onClick(2)}>shows</button>
      <button onClick={() => props.onClick(3)}>calendar</button>
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

function TodaysPremieres(props: {}){

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
      const scheduleSortedByRating = schedule.sort((a: Rating, b: Rating) => {
        return b.show.rating.average - a.show.rating.average;
      });

      let todayShowsByRating: Rating[] = [];
      
      scheduleSortedByRating.forEach((element: Rating) => {
        if (element.show.rating.average > 0 && element.airdate === date){
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
        return (
          <div className="today-episode-cnt">
            <img src={item.show.image.medium} alt=""/><br/>
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



function Home(props: {}){

   return(
    <div className="Home">
      <TodaysPremieres/>
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
    <div className="Search">
      {searchResults && searchResults.length>0 && searchResults.map((item: any) => {
        return (
          <div className="search-episode-cnt">
          <img src={item.show?.image?.medium} alt="no image"/><br/>
          {item.show?.name}<br/>
          {console.log(searchResults)}
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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: genre,
    type: type,
    status: status,
    language: language,
    country: country
  });

  const listPage: number = Math.floor((showsPage*25)/250);
  const index: number = (Math.floor(showsPage/5)*125)-(listPage*250);
  const abort = new AbortController();
  const signal = abort.signal;
  let showsArray: Array<{}> = [];
  

  function updateFilters(){
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
 
    const showsArrayLast = (((showsPage%5)+1)*25);
    const showsArrayFirst = showsArrayLast-25;

    fetch("https://api.tvmaze.com/shows?page="+page, {signal})
    .then(res => {
      if (res.ok){
        return res.json();
      }else{
        return Promise.reject();
      }
    })
    .then(response => {
      const showList: any = response;
      for(let i: number = index; showsArray.length<125; i++){
        if(showList[i] !== undefined){
          if (showsArray.length<125 && applyFilters(showList[i])){
            showsArray.push(showList[i]);
          }
        }else{
          break;
        }
      }
      if (showsArray.length<125){
        getShowList(page+1, 0);
      }else{
        setButtons(Math.floor(showsArray.length/25));
        setShowsToShow(showsArray.slice(showsArrayFirst, showsArrayLast));
        setLoading(false);
      }
    })
    .catch(err => {
      setShowsToShow(showsArray.slice(showsArrayFirst, showsArrayLast));
      setButtons(Math.floor(showsArray.length/25));
      setLoading(false);
    });
  }

  useEffect(()=>{
    getShowList(listPage, index);

    return function cleanup(){
      abort.abort();
      showsArray = [];
      setLoading(true);
    }

  },[showsPage, filters]);

  return(
    <div className="Shows">
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

  return (
    <div className="Calendar">
      <table>
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
                  <td>
                    {day}
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

function Main(props: {currentState: string, stateList: Array<string>, toSearch: string}){

  const currentState = props.currentState;
  const stateList = props.stateList;

  switch (currentState) {
    case (stateList[0]) :
      return <Home/>;
    case (stateList[1]) :
      return <Search toSearch={props.toSearch}/>;
    case (stateList[2]) :
      return <Shows/>;
    case (stateList[3]) :
      return <Calendar/>
    default:
      return <Home/>;
  }

}

function App() {

  const stateList: Array<string> = ["home", "search", "shows", "calendar"];
  const [mainState, setMainState] = useState(stateList[0]);
  const [searchValue, setSearchValue] = useState("");
  const [toSearch, setToSearch] = useState("");

  function handleClick(i: number){
    setMainState(stateList[i]);
    setToSearch(searchValue);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
    setSearchValue(e.target.value);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.key === "Enter"){
      setMainState(stateList[1]);
      setToSearch(searchValue);
    }
  }

  return (
    <div className="App">
      <Header 
        onClick={(i) => handleClick(i)} 
        searchValue={searchValue} 
        onChange={(e) => handleSearch(e)} 
        onKeyDown={(e) => handleEnter(e)}
      />
      <Main currentState={mainState} stateList={stateList} toSearch={toSearch}/>
    </div>
  );
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
