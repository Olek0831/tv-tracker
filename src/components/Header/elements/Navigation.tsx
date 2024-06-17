import React from "react";
import RenderMenuByWidth from "./RenderMenuByWidth";

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

export default Navigation;