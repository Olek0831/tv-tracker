import React, { useEffect, useState, useRef, useLayoutEffect} from 'react';
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
          placeholder="Search shows..."
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
  );
}

function RenderMenuByWidth(props: {onClick:(i:number)=>void}){

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navExpanded, setNavExpanded] = useState(false);

  function resizeWindow(){
    setWindowWidth(window.innerWidth);
  }

  function handleNavClick(i: number){
    setNavExpanded(false);
    props.onClick(i);
  }

  useLayoutEffect(() => {
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  if (windowWidth <= 768){
    return (
      <>
        <button className="menu-btn nav-btn" onClick={() => setNavExpanded(!navExpanded)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <p className="menu-btn-text">Menu</p>
        </button>
        <div className={navExpanded ? "nav-menu expanded" : "nav-menu"}>
          <ul>
            <li key={"shows"}>
              <button className="nav-menu-btn nav-btn" onClick={() => handleNavClick(2)}>Shows</button>
            </li>
            <li key={"calendar"}>
              <button className="nav-menu-btn nav-btn" onClick={() => handleNavClick(3)}>Calendar</button>
            </li>
          </ul>
        </div>
      </>
    );
  }else{
    return (
      <>
        <button className="nav-btn" onClick={() => props.onClick(2)}>Shows</button>
        <button className="nav-btn" onClick={() => props.onClick(3)}>Calendar</button>
      </>
    );
  }
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
      <RenderMenuByWidth onClick={(i) => props.onClick(i)}/>
    </div>
  );
}

function Header(props: BannerProps){
  return(
    <div className="Header">
      <Banner onClick={(i) => props.onClick(i)} searchValue={props.searchValue} onChange={(e) => props.onChange(e)} onKeyDown={(e) => props.onKeyDown(e)}/>
      <Navigation onClick={(i) => props.onClick(i)}/>
    </div>
  );
}

function FullSchedule(props: {ep: Array<EpisodeWithShow>, date: string, details: (id: number, season?: number, episodeID?: number)=>void}){

  let airtimesArray: Array<string> = [];

  props.ep.forEach((element: EpisodeWithShow) => {
    if (element.airtime && !airtimesArray.includes(element.airtime) && element.airdate === props.date){
      airtimesArray.push(element.airtime);
    }
  })

  airtimesArray.sort();

  return(
    <table className="full-sch-table">
      {airtimesArray.map((time, i) => {
        return(
          <tbody key={time}>
            <tr>
              <th className="full-sch-header">{time}</th>
            </tr>
          {props.ep.map((episode: EpisodeWithShow, j) => {
            if (episode.airtime === time){
              return (
                <tr key={episode.id.toString()}>
                  <td className="full-sch-data">
                    <button className="full-sch-show-name" onClick={() => props.details(episode.show.id)}>
                      {episode.show.name}
                    </button>
                    <br/>
                    <button className="full-sch-ep-name" onClick={() => props.details(episode.show.id, episode.season, episode.number)}>
                      {episode.name}
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

function TodaysPremieres(props: {shows: Array<EpisodeWithShow>, moreShows: ()=>void, details: (id: number, season?: number, episodeID?: number)=>void}){

  let imgSrc: string;
  let rating: number = 0;
  let noRating: string = "";
  

  return(
    <>
    <h2 className="today-header">Best shows airing tonight</h2>
    <div className="todays-premieres">
      {props.shows && props.shows.length>0 && props.shows.map((item: EpisodeWithShow, i: number)=>{

        if(item.show.image?.medium){
          imgSrc = item.show.image.medium;
        }else{
          imgSrc = require(".//img/Placeholder.png");
        }

        if (item.show.rating?.average){
          rating = item.show.rating.average;
        }else{
          noRating = "(not rated)";
        }

        return (
          <div key={item.id.toString()} className="today-episode-cnt">
            <img className="today-episode-img" src={imgSrc} onClick={() => props.details(item.show.id)} alt="Show Image"/><br/>
            <div className="today-ep-info-cnt">
              <button className="today-title show-title" onClick={() => props.details(item.show.id)}>{item.show.name}</button><br/>
              <button className="today-title ep-title" onClick={() => props.details(item.show.id, item.season, item.number)}>{item.name}</button><br/>
              <div className="today-ep-info">
              Airtime: {item.airtime}<br/>
              Rating: {rating}/10 {noRating}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <button className="more-shows" onClick={() => props.moreShows()}>More shows &nbsp;&gt;&gt;</button>
    </> 
  );

}

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

function Search(props: {toSearch: string, details: (id:number) => void}){

  const[searchResults, setSearchResults] = useState<Array<SearchedShow>>([]);
  const[loading, setLoading] = useState(true);
  const[errorCode, setErrorCode] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;
  let imgSrc: string;

  const getSearchResults=()=>{
    fetch("https://api.tvmaze.com/search/shows?q="+props.toSearch, {signal})
    .then(res => {
      if(res.ok){
        return res.json();
      }else{
        return Promise.reject(res.status);
      }
      
    })
    .then((results: Array<SearchedShow>) => {
      setSearchResults(results);
      setLoading(false);
    })
    .catch(err => {
      setErrorCode(err);
    })
  }

  useEffect(() => {
    setLoading(true);
    getSearchResults();
    setErrorCode(0);

    return function cleanup(){
      controller.abort();
    }
  },[props.toSearch]);

  if(!(errorCode)){
    if(loading){
      return (
        <div className="loader">
          <div className="loading-animation"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )
    }else if(!(searchResults.length)){
      return (
        <div className="no-matches">It looks like we didn't find what you're looking for.</div>
      )
    }else{
      return (
        <div className="Search main">
          {searchResults && searchResults.length>0 && searchResults.map((item: SearchedShow) => {

            if(item.show.image?.medium){
              imgSrc = item.show.image.medium;
            }else{
              imgSrc = require(".//img/Placeholder.png");
            }

            return (
              <div key={item.show.id} className="show-cnt">
                <img className="show-img" src={imgSrc} onClick={() => props.details(item.show.id)} alt="Show Image"/>
                <div className="showlist-show-info-cnt">
                  <button className="showlist-show-title-btn" onClick={() => props.details(item.show.id)}>
                    {item.show.name}
                  </button>  
                </div>
              </div>
            )
          })}
        </div>
      );
    }
  }else{
    return (
      <div className="Search main">
        <ErrorHandler errorCode={errorCode}/>
      </div>
    );
  }
}

function FilterBarMobile(props: FilterProps){

  const [filtersExpanded, setFiltersExpanded] = useState(false);

  function onFilterClick(){
    setFiltersExpanded(!filtersExpanded);
    props.onClick();
  }

  function onClrClick(){
    setFiltersExpanded(!filtersExpanded);
    props.onClr();
  }

  return(
    <>
      <div className="expand-filters">
        <button className="expand-filters-btn" onClick={() => setFiltersExpanded(!filtersExpanded)}>
          Filters
          <svg xmlns="http://www.w3.org/2000/svg" className={filtersExpanded ? "icon icon-tabler icon-tabler-chevron-down expanded" : "icon icon-tabler icon-tabler-chevron-down"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      <div className={filtersExpanded ? "filter-list expanded" : "filter-list"}>
        <ul>
          <li>
            <label className="filter-label" htmlFor="genre">Genre</label>
            <select id="genre" value={props.genre} onChange={(e) => props.onGenreChange(e)}>
              {genres.map((item) => {
                return <option key={item.value} value={item.value}>{item.value}</option>
              })}
            </select>
          </li>
          <li>
            <label className="filter-label" htmlFor="type">Show Type</label>
            <select id="type" value={props.type} onChange={(e) => props.onTypeChange(e)}>
              {types.map((item) => {
                return <option key={item.value} value={item.value}>{item.value}</option>
              })}
            </select>
          </li>
          <li>
            <label className="filter-label" htmlFor="status">Show Status</label>
            <select id="status" value={props.status} onChange={(e) => props.onStatusChange(e)}>
              {statuses.map((item) => {
                return <option key={item.value} value={item.value}>{item.value}</option>
              })}
            </select>
          </li>
          <li>
            <label className="filter-label" htmlFor="language">Language</label>
            <select id="language" value={props.language} onChange={(e) => props.onLanguageChange(e)}>
              {languages.map((item) => {
                return <option key={item.value} value={item.value}>{item.value}</option>
              })}
            </select>
          </li>
          <li>
            <label className="filter-label" htmlFor="country">Country</label>
            <select id="country" value={props.country} onChange={(e) => props.onCountryChange(e)}>
              {countries.map((item) => {
                return <option key={item.value} value={item.value}>{item.value}</option>
              })}
            </select>
          </li>
          <li>
              <button className="apply-filters-btn" onClick={() => onFilterClick()}>Filter</button>
              <button className="clr-filters-btn apply-filters-btn" onClick={() => onClrClick()}>Clear All</button>
          </li>
        </ul>
      </div>
    </>
  );
}

function FilterBarDesktop(props: FilterProps){

  return(
    <div className="filter-bar">
      <h2>Filters</h2>
      <ul>
        <li>
          <label className="filter-label" htmlFor="genre">Genre</label>
          <select id="genre" value={props.genre} onChange={(e) => props.onGenreChange(e)}>
            {genres.map((item) => {
              return <option key={item.value} value={item.value}>{item.value}</option>
            })}
          </select>
        </li>
        <li>
          <label className="filter-label" htmlFor="type">Show Type</label>
          <select id="type" value={props.type} onChange={(e) => props.onTypeChange(e)}>
            {types.map((item) => {
              return <option key={item.value} value={item.value}>{item.value}</option>
            })}
          </select>
        </li>
        <li>
          <label className="filter-label" htmlFor="status">Show Status</label>
          <select id="status" value={props.status} onChange={(e) => props.onStatusChange(e)}>
            {statuses.map((item) => {
              return <option key={item.value} value={item.value}>{item.value}</option>
            })}
          </select>
        </li>
        <li>
          <label className="filter-label" htmlFor="language">Language</label>
          <select id="language" value={props.language} onChange={(e) => props.onLanguageChange(e)}>
            {languages.map((item) => {
              return <option key={item.value} value={item.value}>{item.value}</option>
            })}
          </select>
        </li>
        <li>
          <label className="filter-label" htmlFor="country">Country</label>
          <select id="country" value={props.country} onChange={(e) => props.onCountryChange(e)}>
            {countries.map((item) => {
              return <option key={item.value} value={item.value}>{item.value}</option>
            })}
          </select>
        </li>
        <li>
          <button className="apply-filters-btn" onClick={() => props.onClick()}>Filter</button>
          <button className="clr-filters-btn apply-filters-btn" onClick={() => props.onClr()}>Clear All</button>
        </li>
      </ul>
    </div>
  );
}

function Filter(props: FilterProps){

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function resizeWindow(){
    setWindowWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    window.addEventListener("resize", resizeWindow);

    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  if (windowWidth <= 768){
    return <FilterBarMobile
              genre={props.genre} 
              type={props.type}
              status={props.status}
              language={props.language}
              country={props.country}
              onGenreChange={(e) => props.onGenreChange(e)}
              onTypeChange={(e) => props.onTypeChange(e)}
              onStatusChange={(e) => props.onStatusChange(e)}
              onLanguageChange={(e) => props.onLanguageChange(e)}
              onCountryChange={(e) => props.onCountryChange(e)}
              onClick={() => props.onClick()}
              onClr={() => props.onClr()}
            />
  }else{
    return <FilterBarDesktop
              genre={props.genre} 
              type={props.type}
              status={props.status}
              language={props.language}
              country={props.country}
              onGenreChange={(e) => props.onGenreChange(e)}
              onTypeChange={(e) => props.onTypeChange(e)}
              onStatusChange={(e) => props.onStatusChange(e)}
              onLanguageChange={(e) => props.onLanguageChange(e)}
              onCountryChange={(e) => props.onCountryChange(e)}
              onClick={() => props.onClick()}
              onClr={() => props.onClr()}
            />
  }
}

function Pagination(props: {page: number, addButtons: number, onClick: (i: number)=>void, onPrev: ()=>void, onNext: ()=>void}){

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
      return <button key={i} className="pagination-button active">{i}</button>;
    }else{
      return <button key={i} className="pagination-button" onClick={() => props.onClick(i-1)}>{i}</button>;
    }
  }

  return(
    <div className="pagination-cnt">
      <div className="pagination-prev-cnt">
        <button className="pagination-prev-btn" onClick={() => props.onPrev()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-left" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 15l-6 -6l-6 6h12" transform="rotate(270 12 12)" />
          </svg>
        </button>
      </div>
      <div className="pagination-btns-cnt">
      {Array(buttons).fill(null).map((item: null, i) => {
        if (currentPage<=5){
          return renderButton(i+1);
        }else{
          return renderButton((currentPage-4)+i);
        }
      })}
      </div>
      <div className="pagination-next-cnt">
        <button className="pagination-next-btn" onClick={() => props.onNext()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-right" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 15l-6 -6l-6 6h12" transform="rotate(90 12 12)" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Loader(props: LoaderProps){

  if (props.loading === true){
    return (
      <div className="loader">
        <div className="loading-animation"></div>
        <div className="loading-text">Loading...</div>
      </div>
    )
  }else if(props.showsToShow.length === 0){
    return (
      <div className="no-matches">It looks like we didn't find what you're looking for.</div>
    )
  }else{
    let imgSrc: string;
    return (
      <>
        <div className="shows-main">
          {props.showsToShow && props.showsToShow.length>0 && props.showsToShow.map((item: Show) => {

            if(item.image?.medium){
              imgSrc = item.image?.medium;
            }else{
              imgSrc = require(".//img/Placeholder.png");
            }

            return (
              <div key={item.id} className="show-cnt">
                <img className="show-img" src={imgSrc} onClick={() => props.details(item.id)} alt="Show Image"/>
                <div className="showlist-show-info-cnt">
                  <button className="showlist-show-title-btn" onClick={() => props.details(item.id)}>{item.name}</button>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination page={props.showsPage} addButtons={props.buttons} onClick={(i) => props.handlePagination(i)} onPrev={() => props.onPrev()} onNext={() => props.onNext()}/>
      </>
    )
  }
}

function Shows(props: {details: (id: number)=>void}){

  const [showsPage, setShowsPage] = useState(0);
  const [showsToShow, setShowsToShow] = useState<Array<Show>>([]);
  const [buttons, setButtons] = useState(0);
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(0);
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
  let showsArray: Array<Show> = [];

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

  function clearFilters(){
    setLoading(true);
    const filtersObj = {
      genre: "",
      type: "",
      status: "",
      language: "",
      country: ""
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

  function setPrevPage(showsPage: number){
    if(showsPage === 0){
      return showsPage;
    }else{
      return showsPage-1;
    }
  }

  function handlePrev(){
    setLoading(true);
    setShowsPage((showsPage) => setPrevPage(showsPage));
  }


function setNextPage(showsPage: number){
  if(showsPage > 5 && buttons === 0){
    return showsPage;
  }else{
    return showsPage+1;
  }
}

  function handleNext(){
    setLoading(true);
    setShowsPage((showsPage) => setNextPage(showsPage));
  }

  function applyFilters({genres, type, status, language, network}: Show){
    let g: boolean, t: boolean, s: boolean, l: boolean, c: boolean;
    if ((filters.genre !== "" && genres?.includes(filters.genre))||(filters.genre === "")){
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
    if ((filters.country !== "" && filters.country === network.country.name)||(filters.country === "")){
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
        return Promise.reject(res.status);
      }
    })
    .then((response: Array<Show>) => {
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
      if (!(err === 404)){
        setErrorCode(err);
      }
    })
  }

  useEffect(() => {
    getShowList(listPage.current[showsPage], firstIndex.current[showsPage]);
    setErrorCode(0);

    return function cleanup(){
      abort.abort();
    }
  }, [showsPage, filters]);

  if(!(errorCode)){
    return(
      <div className="Shows main">
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
          onClr={() => clearFilters()}
        />
        <Loader 
          loading={loading}
          showsToShow={showsToShow}
          showsPage={showsPage} 
          buttons={buttons}
          handlePagination={(i) => handlePagination(i)}
          onPrev={() => handlePrev()}
          onNext={() => handleNext()}
          details={(id) => props.details(id)}
        />
      </div>
    );
  }else{
    return (
      <div className="Search main">
        <ErrorHandler errorCode={errorCode}/>
      </div>
    );
  }
}

function RenderDay(props: {day: number, i: number, j:number, days: string[], schedule: Array<Array<EpisodeWithShow>>, details: (id: number, season?: number, episodeID?: number) => void}){
 
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
            <button className="cal-show-name-btn" onClick={() => props.details(episode.show.id)}>
              {episode.show.name}
            </button>
            <br/>
            <button className="cal-episode-name-btn" onClick={() => props.details(episode.show.id, episode.season, episode.number)}>
              {episode.name}
            </button>
            <br/>
          </div>
        )
      })}
    </div>
  )
}

function CalendarLoader(props: {loading: boolean, currentMonth: number, currentYear: number, daysArr: number[], schedule: Array<Array<EpisodeWithShow>>, onPrev: () => void, onNext: () => void, details: (id: number, season?: number, episodeID?: number) => void}){
 
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
        {Array(Math.floor((props.daysArr.length/7)+1)).fill(null).map((item: null, i) => {
          return (
            <div key={i} className="table-row">
              {props.daysArr.slice(i*7, (i*7)+7).map((day, j) => {
                return <RenderDay key={day} day={day} i={i} j={j} days={days} schedule={props.schedule} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
              })}
            </div>
          )
        })}
      </div>
      </>
    )
  }
}

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

function EpisodeTable(props: {episodes: Array<Episode>, onClick:(season: number, episodeID: number)=>void}){
  return (
    <>
    <h2>Episode List</h2>
      <div className="episodes-cnt">
        <div className="episode-name episodes-header">Episode Name</div>
        <div className="episode-airdate episodes-header">Airdate</div>
      </div>
      {[...props.episodes].reverse().map((episode: Episode, i) => {
        return (
          <div className="episode-row" key={episode.id}>
            <div className="episode-name">
              <button className="episode-name-btn" onClick={() => props.onClick(episode.season, episode.number)}>
                {episode.name}
              </button>
            </div>
            <div className="episode-airdate">
              {episode.airdate}
            </div>
          </div>
          )
        })}
    </>
  )
}

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

function Info(props: {id: number, season?: number, episodeID?: number}){

  const [show, setShow] = useState<ShowWithEpisodes>();
  const [season, setSeason] = useState(props.season);
  const [episodeID, setEpisodeID] = useState(props.episodeID);
  const [errorCode, setErrorCode] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;

  function getShowInfo(){
    fetch("https://api.tvmaze.com/shows/"+props.id+"?embed=episodes", {signal})
    .then(res => {
      if (res.ok){
        return res.json();
      }else{
        return Promise.reject(res.status);
      }
    })
    .then((response: ShowWithEpisodes) => {
      setShow(response);
    })
    .catch(err => {
      setErrorCode(err);
    })
  }

  useEffect(() => {
    getShowInfo();

    return function cleanup(){
      controller.abort();
    }
  },[]);

  function handleTableClick(season: number, episodeID: number){
    setSeason(season);
    setEpisodeID(episodeID);
  }

  function backToShow(){
    setSeason(undefined);
    setEpisodeID(undefined);
  }

  if (show){
    const episodes = show._embedded.episodes;
    let renderTable;
    let renderInfo;
    let detailListComponent;
    let showName = <h2>{show.name}</h2>;

    if ((season) && (episodeID)){
      showName = <button className="back-to-show-btn" onClick={() => backToShow()}><h2>{show.name}</h2></button>
      episodes.forEach((episode: Episode) => {
        if ((episode.season === season) && (episode.number === episodeID)){

          let summary: JSX.Element | string;
          let runtime: JSX.Element | string;
          let imgSrc: string;

          if(episode.image?.medium){
            imgSrc = episode.image.medium;
          }else{
            imgSrc = require(".//img/Placeholder.png");
          }

          if (episode.summary){
            summary = <div className="show-description" dangerouslySetInnerHTML={{__html: episode.summary}}/>;
          }else{
            summary = "";
          }

          if (episode.runtime){
            runtime = <li><b>Runtime:</b> {episode.runtime}</li>;
          }else{
            runtime = "";
          }

          renderInfo = {
            name: <h4>{episode.name}</h4>,
            image: <img className="info-img" src={imgSrc} alt="Episode Image"/>,
            header: "Episode Info",
            country: <li><b>Country:</b> {show.network.country.name}</li>,
            network: <li><b>Network:</b> <a href={show.officialSite}>{show.network.name}</a></li>,
            statusOrNumber: <li><b>Number:</b> Season {episode.season}, Episode {episode.number}</li>,
            typeOrAirdate: <li><b>Airdate:</b> {episode.airdate}</li>,
            airtime: <li><b>Airtime:</b> {episode.airtime}</li>,
            ratingOrRuntime: runtime,
            description: summary
          };
        }
      });
      renderTable = "";
    } else{
      let summary: JSX.Element | string;
      let rating: JSX.Element | string;
      let imgSrc: string;

      if(show.image?.medium){
        imgSrc = show.image.medium;
      }else{
        imgSrc = require(".//img/Placeholder.png");
      }

      if (show.summary){
        summary = <div className="show-description" dangerouslySetInnerHTML={{__html: show.summary}}/>;
      }else{
        summary = "";
      }

      if(show.rating?.average){
        rating = <li><b>Rating:</b> {show.rating.average}/10</li>;
      }else{
        rating = "";
      }
      renderInfo = {
        name: "",
        image: <img className="info-img" src={imgSrc} alt="Show Image"/>,
        header: "Show Info",
        country: <li><b>Country:</b> {show.network.country.name}</li>,
        network: <li><b>Network:</b> <a href={show.officialSite}>{show.network.name}</a></li>,
        statusOrNumber: <li><b>Status:</b> {show.status}</li>,
        typeOrAirdate: <li><b>Show Type:</b> {show.type}</li>,
        genres: show.genres,
        ratingOrRuntime: rating,
        description: summary
      };
      renderTable = <EpisodeTable episodes={episodes} onClick={(season, episodeID) => handleTableClick(season, episodeID)}/>;
    }

    if(renderInfo){
      detailListComponent = <DetailList info = {renderInfo}/>
    }



    return (
      <div className="show-info main">
        {showName}
        {detailListComponent}
        {renderTable}
      </div> 
    );
  }else if(errorCode){
    return (
      <div className="Search main">
        <ErrorHandler errorCode={errorCode}/>
      </div>
    );
  }else{
    return (
      <div className="loader">
        <div className="loading-animation"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }
}

function ErrorHandler(props: {errorCode: number}){

  let errorMessage: string;

  if (props.errorCode >= 500){
    if (props.errorCode === 502){
      errorMessage = "502 - Bad Gateway";
    }else if(props.errorCode === 503){
      errorMessage = "503 - Service Unavailable";
    }else if(props.errorCode === 504){
      errorMessage = "504 - Gateway Timeout";
    }else{
      errorMessage = props.errorCode+" - Server Error";
    }
  }else if(props.errorCode === 404){
    errorMessage = "404 - Resource Not Found";
  }else{
    errorMessage = props.errorCode+" - An Error Occured";
  }

  return <div className="error-cnt">{errorMessage}</div>
}

function Main(props: MainProps){

  const currentState = props.currentState;
  const stateList = props.stateList;

  switch (currentState) {
    case (stateList[0]) :
      return <Home moreShows={() => props.moreShows()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
    case (stateList[1]) :
      return <Search toSearch={props.toSearch} details={(id) => props.details(id)}/>;
    case (stateList[2]) :
      return <Shows details={(id) => props.details(id)}/>;
    case (stateList[3]) :
      return <Calendar details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
    case(stateList[4]) :
      return <Info id={props.ID} season={props.season} episodeID={props.episodeID}/>;
    default:
      return <Home moreShows={() => props.moreShows()} details={(id, season?, episodeID?) => props.details(id, season, episodeID)}/>;
  }

}

function App() {

  const stateList: Array<string> = ["home", "search", "shows", "calendar", "info"];
  const [mainState, setMainState] = useState(stateList[0]);
  const [searchValue, setSearchValue] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showId, setShowID] = useState(0);
  const [season, setSeason] = useState<number>();
  const [episodeID, setEpisodeID] = useState<number>();

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

  function handleDetails(id: number, season?: number, episodeID?: number){
    setShowID(id);

    if(season){
      setSeason(season);
    }else{
      setSeason(undefined);
    }

    if(episodeID){
      setEpisodeID(episodeID);
    }else{
      setEpisodeID(undefined);
    }

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
        season={season}
        episodeID={episodeID}
        details={(id, season?, episodeID?) => handleDetails(id, season, episodeID)}
      />
    </div>
  );
}

interface Show{
  id: number,
  name: string,
  type: string,
  language: string,
  genres?: Array<string>,
  officialSite: string,
  status: string,
  summary?: string,
  network: {
    name: string
    country: {
      name: string
    }
  }
  image?: {
    medium: string
  }
  rating?: {
    average: number
  }
}

interface SearchedShow{
  show: Show
}

interface Episode {
  id: number,
  season: number,
  number: number,
  airdate: string,
  airtime?: string,
  name: string,
  runtime?: number,
  summary?: string,
  image?: {
    medium: string
  }
}

interface EpisodeWithShow extends Episode{
  show: Show
}

interface ShowWithEpisodes extends Show{
  _embedded: {
    episodes: Array<Episode>
  }
}

interface Info{
  name: string,
  image: JSX.Element,
  header: string,
  country: JSX.Element,
  network: JSX.Element,
  statusOrNumber: JSX.Element,
  typeOrAirdate: JSX.Element,
  genres?: Array<string>,
  airtime?: JSX.Element,
  ratingOrRuntime: JSX.Element | string,
  description: JSX.Element | string
}

interface MainProps {
  currentState: string,
  stateList: Array<string>, 
  toSearch: string, 
  moreShows: ()=>void,
  ID: number,
  season?: number,
  episodeID?: number,
  details:(id: number, season?: number, episodeID?: number) => void
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
  onClick: ()=>void,
  onClr: ()=>void
}

interface LoaderProps {
  loading: boolean,
  showsToShow: Array<Show>,
  showsPage: number,
  buttons: number,
  handlePagination: (i: number)=>void,
  onNext: ()=>void,
  onPrev: ()=>void,
  details: (id: number)=>void
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