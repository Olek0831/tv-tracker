import React from "react";
import Banner from "./elements/Banner";
import Navigation from "./elements/Navigation";

function Header(){
  return(
    <div className="Header">
      <Banner />
      <Navigation />
    </div>
  );
}

export default Header;