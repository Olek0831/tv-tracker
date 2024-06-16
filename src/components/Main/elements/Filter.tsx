import React from "react";
import { useState, useLayoutEffect } from "react";
import { genres, types, statuses, languages, countries } from '../../../variables.ts';

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

export default Filter;