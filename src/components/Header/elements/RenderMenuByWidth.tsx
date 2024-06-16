import React from "react";
import { useState, useLayoutEffect } from "react";

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

export default RenderMenuByWidth;