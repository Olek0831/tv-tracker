import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ErrorHandler from '../../elements/ErrorHandler';

function Search(){

  const[searchResults, setSearchResults] = useState<Array<SearchedShow>>([]);
  const[loading, setLoading] = useState(true);
  const[errorCode, setErrorCode] = useState(0);

  const params = useParams();

  const controller = new AbortController();
  const signal = controller.signal;
  let imgSrc: string;

  const getSearchResults=()=>{
    fetch("https://api.tvmaze.com/search/shows?q="+params.searchQuery, {signal})
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
  },[params.searchQuery]);

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
              imgSrc = "/src/assets/img/Placeholder.png";
            }

            return (
              <div key={item.show.id} className="show-cnt">
                <Link to={`/info/${item.show.id}`}>
                  <img className="show-img" src={imgSrc} alt="Show Image"/>
                </Link>
                <div className="showlist-show-info-cnt">
                  <button className="showlist-show-title-btn">
                    <Link to={`/info/${item.show.id}`}>
                      {item.show.name}
                    </Link>
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

export default Search;