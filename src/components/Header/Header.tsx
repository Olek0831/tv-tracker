import React from "react";
import Banner from "./elements/Banner";
import Navigation from "./elements/Navigation";

function Header(props: BannerProps){
  return(
    <div className="Header">
      <Banner onClick={(i) => props.onClick(i)} searchValue={props.searchValue} onChange={(e) => props.onChange(e)} onKeyDown={(e) => props.onKeyDown(e)}/>
      <Navigation onClick={(i) => props.onClick(i)}/>
    </div>
  );
}

export default Header;