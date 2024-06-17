import React from "react";

function Banner(props: BannerProps){
  return(
    <div className="Banner">
      <div className="logo-cnt">
        <button className="logo-btn" onClick={() => props.onClick(0)}>
          <img className="logo" src={"./src/assets/img/TV Tracker.png"} alt="Logo"/>
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

export default Banner;