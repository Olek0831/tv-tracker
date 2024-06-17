import React from 'react';
import { useState, useEffect, useRef } from 'react';
import ErrorHandler from '../../elements/ErrorHandler';
import Loader from '../../elements/Loader';
import Filter from './elements/Filter';

function Shows(){

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

export default Shows;