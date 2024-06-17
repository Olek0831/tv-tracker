import React from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Banner(){

  const params = useParams();
  const [searchValue, setSearchValue] = useState(params.searchQuery ?? '');

  const navigate = useNavigate();

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter"){
      navigate(`/search/${searchValue}`);
    }
  }

  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button className="logo-btn">
          <Link to={'/'}>
            <img className="logo" src={"/src/assets/img/TV Tracker.png"} alt="Logo"/>
          </Link>
        </button>
      </div>
      <div className="search-bar-cnt">
        <input 
          className="search-bar" 
          type="search" 
          placeholder="Search shows..."
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => handleEnter(e)}
        />
        <button className="search-btn">
          <Link to={`/search/${searchValue}`} >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Banner;